import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Package, Truck, Clock, FileText } from 'lucide-react';
import { Order } from '@/hooks/useOrders';
import { getBestDisplayName } from '@/utils/serviceNameCleaner';

interface OrderDetailsModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ order, isOpen, onClose }) => {
  if (!order) return null;

  const getStatusSteps = () => {
    const steps = [
      { 
        key: 'confirmed', 
        label: 'Order Confirmed', 
        icon: CheckCircle,
        time: order.created_at ? new Date(order.created_at).toLocaleString('en-IN', {
          day: '2-digit',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }) : ''
      },
      { 
        key: 'picked_up', 
        label: 'Picked Up', 
        icon: Package,
        time: 'Estimated pickup time'
      },
      { 
        key: 'in_process', 
        label: 'In Process', 
        icon: Clock,
        time: 'Processing at facility'
      },
      { 
        key: 'ready_for_delivery', 
        label: 'Ready for Delivery', 
        icon: Truck,
        time: order.status === 'ready_for_delivery' || order.status === 'delivered' ? 'Estimated delivery' : 'Pending'
      },
      { 
        key: 'delivered', 
        label: 'Delivered', 
        icon: CheckCircle,
        time: order.status === 'delivered' ? 'Completed' : 'Pending'
      }
    ];

    return steps;
  };

  const getCurrentStepIndex = () => {
    const statusOrder = ['confirmed', 'picked_up', 'in_process', 'ready_for_delivery', 'delivered'];
    return statusOrder.indexOf(order.status);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-blue-600 text-blue-100';
      case 'picked_up': return 'bg-purple-600 text-purple-100';
      case 'in_process': return 'bg-orange-600 text-orange-100';
      case 'ready_for_delivery': return 'bg-green-600 text-green-100';
      case 'delivered': return 'bg-green-700 text-green-100';
      default: return 'bg-gray-600 text-gray-100';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Group items by display name to avoid duplicates - improved grouping logic
  const groupedItems = order.order_items?.reduce((acc, item) => {
    const displayName = getBestDisplayName(item.services?.name || 'Service', item.item_name);
    
    if (!acc[displayName]) {
      acc[displayName] = {
        name: displayName,
        totalQuantity: 0,
        pricePerKg: item.services?.base_price_per_kg || 0,
        estimatedWeight: 0,
        finalWeight: 0
      };
    }
    
    acc[displayName].totalQuantity += item.quantity;
    acc[displayName].estimatedWeight += item.estimated_weight || 0;
    acc[displayName].finalWeight += item.final_weight || 0;
    
    return acc;
  }, {} as Record<string, any>) || {};

  const steps = getStatusSteps();
  const currentStepIndex = getCurrentStepIndex();

  // Check if final weight exists, meaning pricing has been calculated
  const hasFinalWeight = order.final_weight !== null && order.final_weight > 0;

  // Get special instructions from booking
  const specialInstructions = order.bookings?.special_note;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-auto bg-white rounded-lg shadow-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b pb-3">
          <DialogTitle className="text-lg font-bold text-gray-900">
            Order Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-3">
          {/* Order Header */}
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-base font-bold text-gray-900">
                {order.order_number}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                {formatDate(order.created_at)}
              </p>
            </div>
            <Badge className={`${getStatusColor(order.status)} border-0 px-2 py-1 text-xs font-medium`}>
              {order.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </Badge>
          </div>

          {/* Special Instructions */}
          {specialInstructions && (
            <div className="border-t pt-3">
              <h4 className="font-semibold text-gray-900 mb-2 text-sm flex items-center">
                <FileText className="w-4 h-4 mr-1" />
                Special Instructions
              </h4>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-gray-700">{specialInstructions}</p>
              </div>
            </div>
          )}

          {/* Status Timeline */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 text-sm">Order Progress</h4>
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = index <= currentStepIndex;
              
              return (
                <div key={step.key} className="flex items-center space-x-3">
                  <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                    isCompleted 
                      ? 'bg-blue-500 text-white shadow-lg' 
                      : 'bg-gray-200 text-gray-400'
                  }`}>
                    <Icon className="w-3 h-3" />
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                      {step.label}
                    </p>
                    <p className={`text-xs ${isCompleted ? 'text-gray-600' : 'text-gray-400'}`}>
                      {step.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="border-t pt-3">
            <h4 className="font-semibold text-gray-900 mb-3 text-sm">Order Summary</h4>
            <div className="space-y-2">
              {Object.values(groupedItems).map((item: any, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <span className="text-gray-900 font-medium text-sm">
                      {item.name}
                    </span>
                    <div className="text-xs text-gray-500 mt-1">
                      Rate: ₹{item.pricePerKg}/kg
                    </div>
                  </div>
                  {(item.finalWeight > 0 || item.estimatedWeight > 0) && (
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {(item.finalWeight || item.estimatedWeight).toFixed(1)} kg
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="border-t mt-3 pt-3 bg-blue-50 rounded-lg p-3">
              {hasFinalWeight ? (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900 text-sm">Total Amount</span>
                    <span className="font-bold text-blue-600 text-lg">
                      ₹{order.final_price}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-600">Total Weight</span>
                    <span className="text-gray-900 font-medium">
                      {order.final_weight} kg
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-1">
                  <div className="text-xs text-gray-600 bg-yellow-50 border border-yellow-200 rounded p-2">
                    💡 Final price will be calculated after weighing
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            {order.status !== 'delivered' && order.status !== 'cancelled' && (
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 shadow-lg text-sm">
                📍 Track Order
              </Button>
            )}

            {order.status === 'delivered' && (
              <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 shadow-lg text-sm">
                ⭐ Rate & Review
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsModal;

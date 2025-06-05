import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Package, Truck, Clock, X } from 'lucide-react';
import { Order } from '@/hooks/useOrders';

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

  const getCleanServiceName = (serviceName: string) => {
    if (!serviceName) return 'Service';
    
    // Split by various separators and clean
    const parts = serviceName.split(/\s*[-–—]\s*|\s*\|\s*|\s*,\s*/);
    
    // Remove duplicates and empty strings, then clean whitespace
    const uniqueParts = [...new Set(parts)]
      .map(part => part.trim())
      .filter(part => part.length > 0);
    
    // If we have duplicates, just take the first unique part
    if (uniqueParts.length > 1) {
      // Check if parts are very similar (like "Bedsheets" and "Bedsheet")
      const normalized = uniqueParts.map(part => part.toLowerCase().replace(/s$/, ''));
      const reallyUnique = [];
      
      for (let i = 0; i < uniqueParts.length; i++) {
        const current = normalized[i];
        if (!reallyUnique.some(existing => 
          existing.toLowerCase().replace(/s$/, '') === current ||
          current.includes(existing.toLowerCase().replace(/s$/, '')) ||
          existing.toLowerCase().replace(/s$/, '').includes(current)
        )) {
          reallyUnique.push(uniqueParts[i]);
        }
      }
      
      return reallyUnique.join(' - ');
    }
    
    return uniqueParts[0] || 'Service';
  };

  // Group items by service name to avoid duplicates
  const groupedItems = order.order_items?.reduce((acc, item) => {
    const cleanName = getCleanServiceName(item.services?.name || 'Service');
    
    if (!acc[cleanName]) {
      acc[cleanName] = {
        name: cleanName,
        totalQuantity: 0,
        totalPrice: 0,
        pricePerKg: item.services?.base_price_per_kg || 0
      };
    }
    
    acc[cleanName].totalQuantity += item.quantity;
    
    // Use final weight if available, otherwise estimated weight
    const itemWeight = item.final_weight || item.estimated_weight || 1;
    acc[cleanName].totalPrice += itemWeight * (item.services?.base_price_per_kg || 0);
    
    return acc;
  }, {} as Record<string, any>) || {};

  const steps = getStatusSteps();
  const currentStepIndex = getCurrentStepIndex();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto bg-white rounded-lg">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div>
            <DialogTitle className="text-lg font-semibold text-gray-900">
              Order Details
            </DialogTitle>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-6 w-6 rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Header */}
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {order.order_number}
              </h3>
              <p className="text-sm text-gray-600">
                {formatDate(order.created_at)}
              </p>
            </div>
            <Badge className={`${getStatusColor(order.status)} border-0`}>
              {order.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </Badge>
          </div>

          {/* Status Timeline */}
          <div className="space-y-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;
              
              return (
                <div key={step.key} className="flex items-center space-x-3">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    isCompleted 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-gray-400'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                      {step.label}
                    </p>
                    <p className={`text-sm ${isCompleted ? 'text-gray-600' : 'text-gray-400'}`}>
                      {step.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="border-t pt-4">
            <h4 className="font-medium text-gray-900 mb-3">Order Summary</h4>
            <div className="space-y-2">
              {Object.values(groupedItems).map((item: any, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {item.name}
                  </span>
                  <span className="text-gray-900 font-medium">
                    ₹{item.totalPrice.toFixed(0)}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t mt-3 pt-2">
              <div className="flex justify-between">
                <span className="font-medium text-gray-900">Total</span>
                <span className="font-bold text-blue-600 text-lg">
                  ₹{order.final_price || order.estimated_price || '0'}
                </span>
              </div>
              {order.final_weight && (
                <div className="flex justify-between mt-1">
                  <span className="text-sm text-gray-600">Weight</span>
                  <span className="text-sm text-gray-900 font-medium">
                    {order.final_weight} kg
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Track Order Button for in-progress orders */}
          {order.status !== 'delivered' && order.status !== 'cancelled' && (
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              Track Order
            </Button>
          )}

          {/* Review Button for delivered orders */}
          {order.status === 'delivered' && (
            <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
              ⭐ Review
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsModal;

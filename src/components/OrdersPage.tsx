
import React, { memo, useState } from 'react';
import AppLayout from './AppLayout';
import { Button } from '@/components/ui/button';
import { Clock, Package, Truck, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useOrders } from '@/hooks/useOrders';
import OrderDetailsModal from './OrderDetailsModal';
import { getBestDisplayName } from '@/utils/serviceNameCleaner';
import type { Order } from '@/hooks/useOrders';

const OrdersPage = memo(() => {
  const {
    orders,
    loading
  } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
    setIsModalOpen(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
      case 'confirmed':
        return <Clock className="w-4 h-4" />;
      case 'picked_up':
      case 'in_process':
        return <Package className="w-4 h-4" />;
      case 'ready_for_delivery':
        return <Truck className="w-4 h-4" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-600/60 text-yellow-100';
      case 'confirmed':
        return 'bg-blue-600/60 text-blue-100';
      case 'picked_up':
        return 'bg-purple-600/60 text-purple-100';
      case 'in_process':
        return 'bg-orange-600/60 text-orange-100';
      case 'ready_for_delivery':
        return 'bg-green-600/60 text-green-100';
      case 'delivered':
        return 'bg-green-700/60 text-green-100';
      case 'cancelled':
        return 'bg-red-600/60 text-red-100';
      default:
        return 'bg-gray-600/60 text-gray-100';
    }
  };

  const formatStatus = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'confirmed':
        return 'Confirmed';
      case 'picked_up':
        return 'Picked Up';
      case 'in_process':
        return 'In Process';
      case 'ready_for_delivery':
        return 'Ready for Delivery';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short'
    });
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-blue-600 text-lg">Loading orders...</div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-3">
        {orders.length === 0 ? (
          <div className="glass-card p-8 text-center">
            <Package className="w-16 h-16 text-blue-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-blue-600 mb-2">No Orders Yet</h3>
            <p className="text-blue-500 mb-6">
              Start by scheduling a pickup for your laundry
            </p>
            <Link to="/services">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Schedule Pickup
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map(order => (
              <div key={order.id} className="glass-card p-3 cursor-pointer hover:bg-blue-50 transition-all duration-200 border border-blue-200 hover:border-blue-300" onClick={() => handleOrderClick(order)}>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex-1">
                    <h3 className="text-blue-600 font-bold text-base">
                      {order.order_number}
                    </h3>
                    <p className="text-blue-500 text-xs">
                      {formatDate(order.created_at)}
                    </p>
                  </div>
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span className="hidden sm:inline">{formatStatus(order.status)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <div className="flex space-x-4">
                    <div>
                      <span className="text-blue-500 text-xs">Items: </span>
                      <span className="text-blue-600 font-medium">
                        {order.order_items?.reduce((sum, item) => sum + item.quantity, 0) || 0}
                      </span>
                    </div>
                    
                    {order.final_weight && (
                      <div>
                        <span className="text-blue-500 text-xs">Weight: </span>
                        <span className="text-blue-600 font-medium">{order.final_weight}kg</span>
                      </div>
                    )}
                  </div>

                  <div className="text-right">
                    {order.final_price && order.final_weight && (order.status === 'delivered' || order.status === 'ready_for_delivery') ? (
                      <div className="text-green-600 font-bold text-sm">₹{order.final_price}</div>
                    ) : (
                      <div className="text-blue-400 text-xs">Pending</div>
                    )}
                  </div>
                </div>

                {order.status === 'pending' && (
                  <div className="mt-2 pt-2 border-t border-blue-200">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-red-500/50 text-red-600 hover:bg-red-50 hover:border-red-500 text-xs h-6 px-2" 
                      onClick={e => {
                        e.stopPropagation();
                        // Handle cancel order
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <OrderDetailsModal order={selectedOrder} isOpen={isModalOpen} onClose={handleCloseModal} />
      </div>
    </AppLayout>
  );
});

OrdersPage.displayName = 'OrdersPage';
export default OrdersPage;

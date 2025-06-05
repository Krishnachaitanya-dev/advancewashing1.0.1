
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
          <div className="text-white text-lg">Loading orders...</div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="glass-card p-8 text-center">
            <Package className="w-16 h-16 text-white/60 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Orders Yet</h3>
            <p className="text-white/80 mb-6">
              Start by scheduling a pickup for your laundry
            </p>
            <Link to="/services">
              <Button className="bg-blue-900 hover:bg-blue-800 text-white">
                Schedule Pickup
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {orders.map(order => (
              <div 
                key={order.id} 
                className="glass-card p-4 cursor-pointer hover:bg-white/5 transition-all duration-200 border border-white/10 hover:border-white/20 h-fit" 
                onClick={() => handleOrderClick(order)}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-white font-bold text-base">
                      {order.order_number}
                    </h3>
                    <p className="text-white/70 text-xs">
                      {formatDate(order.created_at)}
                    </p>
                  </div>
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span className="hidden sm:inline">{formatStatus(order.status)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="bg-white/5 rounded p-2">
                    <div className="text-white/60 text-xs font-medium">Items</div>
                    <div className="text-white text-sm font-semibold">
                      {order.order_items?.reduce((sum, item) => sum + item.quantity, 0) || 0}
                    </div>
                  </div>
                  
                  {order.final_weight && (
                    <div className="bg-white/5 rounded p-2">
                      <div className="text-white/60 text-xs font-medium">Weight</div>
                      <div className="text-white text-sm font-semibold">{order.final_weight} kg</div>
                    </div>
                  )}
                </div>

                {order.final_price && order.final_weight && (order.status === 'delivered' || order.status === 'ready_for_delivery') ? (
                  <div className="bg-green-500/20 rounded p-2 text-center">
                    <div className="text-green-400 font-bold text-lg">₹{order.final_price}</div>
                  </div>
                ) : (
                  <div className="bg-white/5 rounded p-2 text-center">
                    <div className="text-white/70 text-xs">Pending weighing</div>
                  </div>
                )}

                {order.status === 'pending' && (
                  <div className="mt-3 pt-2 border-t border-white/20">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full border-red-500/50 text-red-300 hover:bg-red-500/20 hover:border-red-400 text-xs" 
                      onClick={e => {
                        e.stopPropagation();
                        // Handle cancel order
                      }}
                    >
                      Cancel Order
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

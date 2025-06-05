
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
        return <Clock className="w-5 h-5" />;
      case 'picked_up':
      case 'in_process':
        return <Package className="w-5 h-5" />;
      case 'ready_for_delivery':
        return <Truck className="w-5 h-5" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
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
      month: 'short',
      year: 'numeric'
    });
  };

  const groupedItems = (order: Order) => {
    return order.order_items?.reduce((acc, item) => {
      const displayName = getBestDisplayName(item.services?.name || 'Service', item.item_name);
      if (!acc[displayName]) {
        acc[displayName] = {
          name: displayName,
          quantity: 0,
          pricePerKg: item.services?.base_price_per_kg || 0
        };
      }
      acc[displayName].quantity += item.quantity;
      return acc;
    }, {} as Record<string, any>) || {};
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
      <div className="space-y-6">
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
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="glass-card p-4 cursor-pointer hover:bg-white/5 transition-all duration-200 border border-white/10 hover:border-white/20" onClick={() => handleOrderClick(order)}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-white font-bold text-lg">
                      {order.order_number}
                    </h3>
                    <p className="text-white/70 text-sm mt-1">
                      Ordered on {formatDate(order.created_at)}
                    </p>
                  </div>
                  <div className={`flex items-center space-x-2 px-3 py-2 rounded-full text-sm font-medium shadow-md ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span>{formatStatus(order.status)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="text-white/60 text-xs font-medium uppercase tracking-wide mb-1">Items</div>
                    <div className="text-white font-semibold">
                      {order.order_items?.reduce((sum, item) => sum + item.quantity, 0) || 0} pieces
                    </div>
                  </div>
                  
                  {order.final_weight && (
                    <div className="bg-white/5 rounded-lg p-3">
                      <div className="text-white/60 text-xs font-medium uppercase tracking-wide mb-1">Weight</div>
                      <div className="text-white font-semibold">{order.final_weight} kg</div>
                    </div>
                  )}
                  
                  {order.final_price && order.final_weight && (order.status === 'delivered' || order.status === 'ready_for_delivery') ? (
                    <div className="bg-white/5 rounded-lg p-3">
                      <div className="text-white/60 text-xs font-medium uppercase tracking-wide mb-1">Total</div>
                      <div className="text-white font-bold text-lg text-green-400">₹{order.final_price}</div>
                    </div>
                  ) : (
                    <div className="bg-white/5 rounded-lg p-3">
                      <div className="text-white/60 text-xs font-medium uppercase tracking-wide mb-1">Price</div>
                      <div className="text-white/70 text-sm">Pending weighing</div>
                    </div>
                  )}
                  
                  {order.bookings?.pickup_time && (
                    <div className="bg-white/5 rounded-lg p-3">
                      <div className="text-white/60 text-xs font-medium uppercase tracking-wide mb-1">Pickup</div>
                      <div className="text-white text-sm">{formatDate(order.bookings.pickup_time)}</div>
                    </div>
                  )}
                </div>

                <div className="border-t border-white/20 pt-4">
                  <h4 className="text-white font-medium text-sm mb-3 flex items-center">
                    <Package className="w-4 h-4 mr-2" />
                    Order Items
                  </h4>
                  <div className="space-y-2">
                    {Object.values(groupedItems(order)).map((item: any, index) => (
                      <div key={index} className="flex justify-between items-center bg-white/5 rounded-lg p-3">
                        <span className="text-white font-medium">
                          {item.name}
                        </span>
                        <div className="text-right">
                          <div className="text-white/80 text-sm">₹{item.pricePerKg}/kg</div>
                          {(order.final_weight || order.estimated_weight) && (
                            <div className="text-white/60 text-xs mt-1">
                              Weight available after processing
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {order.status === 'pending' && (
                  <div className="mt-4 pt-3 border-t border-white/20">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-red-500/50 text-red-300 hover:bg-red-500/20 hover:border-red-400" 
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

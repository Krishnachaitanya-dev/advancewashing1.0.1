import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, Package, Truck, Clock, Edit, Save, X } from 'lucide-react';
import { useOrders } from '@/hooks/useOrders';
import { useOrderUpdate } from '@/hooks/useOrderUpdate';
import OrderStatusFilter from './OrderStatusFilter';
import ServiceWeightCalculator from './ServiceWeightCalculator';
import type { Order } from '@/hooks/useOrders';
const AdminOrderManagement = () => {
  const {
    orders,
    loading,
    refetch
  } = useOrders();
  const {
    updateOrder,
    isUpdating
  } = useOrderUpdate();
  const [editingOrder, setEditingOrder] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [editData, setEditData] = useState({
    status: '',
    final_weight: '',
    final_price: ''
  });

  // Filter orders based on selected status
  const filteredOrders = useMemo(() => {
    if (!selectedStatus) return orders;
    return orders.filter(order => order.status === selectedStatus);
  }, [orders, selectedStatus]);

  // Calculate order counts by status
  const orderCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    orders.forEach(order => {
      counts[order.status] = (counts[order.status] || 0) + 1;
    });
    return counts;
  }, [orders]);
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'picked_up':
        return <Package className="w-4 h-4" />;
      case 'in_process':
        return <Clock className="w-4 h-4" />;
      case 'ready_for_delivery':
        return <Truck className="w-4 h-4" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-blue-600 text-blue-100';
      case 'picked_up':
        return 'bg-purple-600 text-purple-100';
      case 'in_process':
        return 'bg-orange-600 text-orange-100';
      case 'ready_for_delivery':
        return 'bg-green-600 text-green-100';
      case 'delivered':
        return 'bg-green-700 text-green-100';
      default:
        return 'bg-gray-600 text-gray-100';
    }
  };
  const statusOptions = [{
    value: 'confirmed',
    label: 'Confirmed'
  }, {
    value: 'picked_up',
    label: 'Picked Up'
  }, {
    value: 'in_process',
    label: 'In Process'
  }, {
    value: 'ready_for_delivery',
    label: 'Ready for Delivery'
  }, {
    value: 'delivered',
    label: 'Delivered'
  }];
  const handleEdit = (order: Order) => {
    setEditingOrder(order.id);
    setEditData({
      status: order.status,
      final_weight: order.final_weight?.toString() || '',
      final_price: order.final_price?.toString() || ''
    });
  };
  const handleSave = async (orderId: string) => {
    const updateData: any = {
      status: editData.status
    };
    if (editData.final_weight) {
      updateData.final_weight = parseFloat(editData.final_weight);
    }
    if (editData.final_price) {
      updateData.final_price = parseFloat(editData.final_price);
    }
    const success = await updateOrder(orderId, updateData);
    if (success) {
      setEditingOrder(null);
      refetch();
    }
  };
  const handleServiceWeightSave = async (orderId: string, weight: number, price: number) => {
    const success = await updateOrder(orderId, {
      final_weight: weight,
      final_price: price
    });
    if (success) {
      refetch();
    }
    return success;
  };
  const handleCancel = () => {
    setEditingOrder(null);
    setEditData({
      status: '',
      final_weight: '',
      final_price: ''
    });
  };
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  if (loading) {
    return <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-white text-lg">Loading orders...</div>
      </div>;
  }
  return <div className="space-y-6">
      

      <OrderStatusFilter selectedStatus={selectedStatus} onStatusChange={setSelectedStatus} orderCounts={orderCounts} />

      <div className="space-y-4">
        {filteredOrders.map(order => <div key={order.id} className="glass-card p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-white font-semibold text-lg">
                  {order.order_number}
                </h3>
                <p className="text-white/70 text-sm">
                  Ordered on {formatDate(order.created_at)}
                </p>
                <p className="text-white/70 text-sm">
                  Customer: {order.bookings?.addresses?.door_no} {order.bookings?.addresses?.street}, {order.bookings?.addresses?.city}
                </p>
              </div>

              <div className="flex items-center space-x-3">
                {editingOrder === order.id ? <div className="flex space-x-2">
                    <Button size="sm" onClick={() => handleSave(order.id)} disabled={isUpdating} className="bg-green-600 hover:bg-green-700">
                      <Save className="w-4 h-4 mr-1" />
                      Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleCancel} className="border-gray-500 text-gray-300">
                      <X className="w-4 h-4 mr-1" />
                      Cancel
                    </Button>
                  </div> : <Button size="sm" onClick={() => handleEdit(order)} className="bg-blue-600 hover:bg-blue-700">
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>}

                <Badge className={`${getStatusColor(order.status)} border-0 flex items-center space-x-1`}>
                  {getStatusIcon(order.status)}
                  <span>{order.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                </Badge>
              </div>
            </div>

            {editingOrder === order.id ? <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-white/80 text-sm mb-2">Status</label>
                    <Select value={editData.status} onValueChange={value => setEditData(prev => ({
                ...prev,
                status: value
              }))}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map(option => <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-white/80 text-sm mb-2">Final Weight (kg)</label>
                    <Input type="number" step="0.1" value={editData.final_weight} onChange={e => setEditData(prev => ({
                ...prev,
                final_weight: e.target.value
              }))} placeholder="Enter weight" className="bg-white/10 border-white/20 text-white placeholder:text-white/50" />
                  </div>

                  <div>
                    <label className="block text-white/80 text-sm mb-2">Final Price (₹)</label>
                    <Input type="number" step="0.01" value={editData.final_price} onChange={e => setEditData(prev => ({
                ...prev,
                final_price: e.target.value
              }))} placeholder="Enter price" className="bg-white/10 border-white/20 text-white placeholder:text-white/50" />
                  </div>
                </div>

                <ServiceWeightCalculator orderId={order.id} orderItems={order.order_items || []} currentFinalWeight={order.final_weight || undefined} currentFinalPrice={order.final_price || undefined} onSave={(weight, price) => handleServiceWeightSave(order.id, weight, price)} isUpdating={isUpdating} />
              </div> : <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-white/80 text-sm">
                  <strong>Items:</strong> {order.order_items?.reduce((sum, item) => sum + item.quantity, 0) || 0} pieces
                </div>
                
                <div className="text-white/80 text-sm">
                  <strong>Est. Weight:</strong> {order.estimated_weight} kg
                </div>

                <div className="text-white/80 text-sm">
                  <strong>Final Weight:</strong> {order.final_weight || 'Not set'} kg
                </div>
                
                <div className="text-white/80 text-sm">
                  <strong>Final Price:</strong> ₹{order.final_price || order.estimated_price || '0'}
                </div>
              </div>}

            <div className="border-t border-white/20 pt-4">
              <h4 className="text-white font-medium text-sm mb-2">Order Items:</h4>
              <div className="space-y-1">
                {order.order_items?.map(item => <div key={item.id} className="flex justify-between text-white/80 text-sm">
                    <span>
                      {item.services?.name} {item.item_name && `- ${item.item_name}`}
                    </span>
                    <span>Qty: {item.quantity} | Est. Weight: {item.estimated_weight}kg</span>
                  </div>)}
              </div>
            </div>

            {order.bookings?.pickup_time && <div className="mt-3 text-white/80 text-sm">
                <strong>Pickup Time:</strong> {formatDate(order.bookings.pickup_time)}
              </div>}

            {order.bookings?.special_note && <div className="mt-2 text-white/80 text-sm">
                <strong>Special Instructions:</strong> {order.bookings.special_note}
              </div>}
          </div>)}

        {filteredOrders.length === 0 && <div className="glass-card p-8 text-center">
            <p className="text-white/70">No orders found for the selected status.</p>
          </div>}
      </div>
    </div>;
};
export default AdminOrderManagement;
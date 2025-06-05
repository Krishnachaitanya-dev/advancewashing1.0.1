import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Package, Truck, Clock } from 'lucide-react';
interface OrderStatusFilterProps {
  selectedStatus: string | null;
  onStatusChange: (status: string | null) => void;
  orderCounts: Record<string, number>;
}
const OrderStatusFilter: React.FC<OrderStatusFilterProps> = ({
  selectedStatus,
  onStatusChange,
  orderCounts
}) => {
  const statusOptions = [{
    value: null,
    label: 'All Orders',
    icon: null,
    color: 'bg-gray-600 text-gray-100'
  }, {
    value: 'confirmed',
    label: 'Confirmed',
    icon: CheckCircle,
    color: 'bg-blue-600 text-blue-100'
  }, {
    value: 'picked_up',
    label: 'Picked Up',
    icon: Package,
    color: 'bg-purple-600 text-purple-100'
  }, {
    value: 'in_process',
    label: 'In Process',
    icon: Clock,
    color: 'bg-orange-600 text-orange-100'
  }, {
    value: 'ready_for_delivery',
    label: 'Ready for Delivery',
    icon: Truck,
    color: 'bg-green-600 text-green-100'
  }, {
    value: 'delivered',
    label: 'Delivered',
    icon: CheckCircle,
    color: 'bg-green-700 text-green-100'
  }];
  return <div className="glass-card p-4 mb-6">
      <h3 className="text-white font-semibold mb-3">Filter by Status</h3>
      <div className="flex flex-wrap gap-2">
        {statusOptions.map(status => {
        const Icon = status.icon;
        const count = status.value ? orderCounts[status.value] || 0 : Object.values(orderCounts).reduce((sum, count) => sum + count, 0);
        return <Button key={status.value || 'all'} onClick={() => onStatusChange(status.value)} variant={selectedStatus === status.value ? "default" : "outline"} className={`flex items-center space-x-2 ${selectedStatus === status.value ? 'bg-white/20 text-white border-white/40' : 'border-white/20 text-white/80 hover:bg-white/10'}`}>
              {Icon && <Icon className="w-4 h-4" />}
              <span className="text-zinc-900">{status.label}</span>
              <Badge className={`${status.color} border-0 ml-1`}>
                {count}
              </Badge>
            </Button>;
      })}
      </div>
    </div>;
};
export default OrderStatusFilter;
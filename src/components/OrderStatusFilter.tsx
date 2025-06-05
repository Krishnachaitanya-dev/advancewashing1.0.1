
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  const statusOptions = [
    {
      value: 'confirmed',
      label: 'Confirmed',
      icon: CheckCircle,
      color: 'bg-blue-600 text-blue-100'
    },
    {
      value: 'picked_up',
      label: 'Picked Up',
      icon: Package,
      color: 'bg-purple-600 text-purple-100'
    },
    {
      value: 'in_process',
      label: 'In Process',
      icon: Clock,
      color: 'bg-orange-600 text-orange-100'
    },
    {
      value: 'ready_for_delivery',
      label: 'Ready for Delivery',
      icon: Truck,
      color: 'bg-green-600 text-green-100'
    },
    {
      value: 'delivered',
      label: 'Delivered',
      icon: CheckCircle,
      color: 'bg-green-700 text-green-100'
    },
    {
      value: null,
      label: 'All Orders',
      icon: null,
      color: 'bg-gray-600 text-gray-100'
    }
  ];

  const handleValueChange = (value: string) => {
    onStatusChange(value === 'all' ? null : value);
  };

  const currentValue = selectedStatus || 'all';

  return (
    <div className="glass-card p-4 mb-6">
      <h3 className="text-white font-semibold mb-3">Filter by Status</h3>
      <Tabs value={currentValue} onValueChange={handleValueChange} className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 bg-white/10 p-1">
          {statusOptions.map((status) => {
            const Icon = status.icon;
            const count = status.value ? orderCounts[status.value] || 0 : Object.values(orderCounts).reduce((sum, count) => sum + count, 0);
            const tabValue = status.value || 'all';
            
            return (
              <TabsTrigger
                key={tabValue}
                value={tabValue}
                className="flex items-center space-x-2 data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/70 hover:text-white transition-colors"
              >
                {Icon && <Icon className="w-4 h-4" />}
                <span className="hidden sm:inline">{status.label}</span>
                <Badge className={`${status.color} border-0 ml-1 text-xs`}>
                  {count}
                </Badge>
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>
    </div>
  );
};

export default OrderStatusFilter;

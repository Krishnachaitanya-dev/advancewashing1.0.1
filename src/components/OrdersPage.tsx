
import React from 'react';
import AppLayout from './AppLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const OrdersPage = () => {
  const orderStatuses = [
    {
      id: "active",
      name: "Active",
      orders: [
        {
          id: "AW2023154",
          date: "May 22, 2025",
          service: "Regular Wash",
          items: 5,
          status: "In Progress",
          statusIcon: <Clock className="w-4 h-4" />,
          statusColor: "bg-blue-600",
          amount: "$29.95"
        },
        {
          id: "AW2023148",
          date: "May 20, 2025",
          service: "Express Service",
          items: 3,
          status: "Ready for Pickup",
          statusIcon: <Package className="w-4 h-4" />,
          statusColor: "bg-green-600",
          amount: "$35.50"
        }
      ]
    },
    {
      id: "completed",
      name: "Completed",
      orders: [
        {
          id: "AW2023142",
          date: "May 15, 2025",
          service: "Regular Wash",
          items: 7,
          status: "Completed",
          statusIcon: <CheckCircle className="w-4 h-4" />,
          statusColor: "bg-green-700",
          amount: "$41.93"
        },
        {
          id: "AW2023137",
          date: "May 10, 2025",
          service: "Dry Cleaning",
          items: 2,
          status: "Completed",
          statusIcon: <CheckCircle className="w-4 h-4" />,
          statusColor: "bg-green-700",
          amount: "$25.98"
        },
        {
          id: "AW2023128",
          date: "May 5, 2025",
          service: "Premium Care",
          items: 4,
          status: "Completed",
          statusIcon: <CheckCircle className="w-4 h-4" />,
          statusColor: "bg-green-700",
          amount: "$59.96"
        }
      ]
    },
    {
      id: "cancelled",
      name: "Cancelled",
      orders: [
        {
          id: "AW2023135",
          date: "May 8, 2025",
          service: "Regular Wash",
          items: 3,
          status: "Cancelled",
          statusIcon: <AlertCircle className="w-4 h-4" />,
          statusColor: "bg-red-600",
          amount: "$17.97"
        }
      ]
    }
  ];

  return (
    <AppLayout>
      <h2 className="text-2xl font-bold text-white mb-6">My Orders</h2>

      <Tabs defaultValue="active" className="mb-6">
        <TabsList className="bg-white/10 backdrop-blur-sm w-full flex justify-between mb-6">
          {orderStatuses.map(status => (
            <TabsTrigger 
              key={status.id}
              value={status.id}
              className="flex-1 data-[state=active]:bg-blue-900/60 text-white"
            >
              {status.name}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {orderStatuses.map(status => (
          <TabsContent key={status.id} value={status.id}>
            <div className="space-y-4">
              {status.orders.length === 0 ? (
                <div className="glass-card p-6 text-center">
                  <p className="text-white">No {status.name.toLowerCase()} orders found.</p>
                </div>
              ) : (
                status.orders.map(order => (
                  <div key={order.id} className="glass-card p-4">
                    <div className="flex justify-between mb-3">
                      <h3 className="text-lg font-medium text-white">#{order.id}</h3>
                      <span className="text-white font-bold">{order.amount}</span>
                    </div>
                    <div className="flex justify-between mb-3">
                      <p className="text-white/80">{order.service}</p>
                      <p className="text-white/80">{order.date}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-white/70 text-sm">{order.items} items</p>
                      <div className={`${order.statusColor} text-white text-xs flex items-center px-2 py-1 rounded`}>
                        {order.statusIcon}
                        <span className="ml-1">{order.status}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </AppLayout>
  );
};

export default OrdersPage;

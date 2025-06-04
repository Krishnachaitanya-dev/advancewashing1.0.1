import React, { useState } from 'react';
import AppLayout from './AppLayout';
import { Button } from '@/components/ui/button';
import { CalendarClock, TrendingUp, Package, CheckCircle, Truck, Timer } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

const OrdersPage = () => {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [trackingOpen, setTrackingOpen] = useState(false);

  // Function to get the appropriate icon for each tracking step
  const getStepIcon = (title: string, completed: boolean) => {
    const iconProps = { size: 16, className: "text-white" };
    
    switch (title) {
      case 'Order Confirmed':
        return <CheckCircle {...iconProps} />;
      case 'Picked Up':
        return <Truck {...iconProps} />;
      case 'In Process':
        return <Timer {...iconProps} />;
      case 'Ready for Delivery':
        return <Package {...iconProps} />;
      case 'Delivered':
        return <CheckCircle {...iconProps} />;
      default:
        return <div className="h-3 w-3 bg-gray-300 rounded-full"></div>;
    }
  };

  const orders = [{
    id: 'AWO-1001',
    date: '2023-06-01',
    status: 'Delivered',
    items: [{
      name: 'Regular Wash',
      quantity: '2 kg',
      price: '₹200'
    }, {
      name: 'Ironing Service',
      quantity: '5 items',
      price: '₹300'
    }],
    total: '₹500',
    trackingSteps: [{
      title: 'Order Confirmed',
      time: '01 June, 10:00 AM',
      completed: true
    }, {
      title: 'Picked Up',
      time: '01 June, 11:30 AM',
      completed: true
    }, {
      title: 'In Process',
      time: '01 June, 2:00 PM',
      completed: true
    }, {
      title: 'Ready for Delivery',
      time: '02 June, 10:00 AM',
      completed: true
    }, {
      title: 'Delivered',
      time: '02 June, 5:30 PM',
      completed: true
    }]
  }, {
    id: 'AWO-1002',
    date: '2023-06-05',
    status: 'In Progress',
    items: [{
      name: 'Delicate Wash',
      quantity: '1 kg',
      price: '₹250'
    }, {
      name: 'Dry Cleaning',
      quantity: '3 items',
      price: '₹450'
    }],
    total: '₹700',
    trackingSteps: [{
      title: 'Order Confirmed',
      time: '05 June, 9:00 AM',
      completed: true
    }, {
      title: 'Picked Up',
      time: '05 June, 12:30 PM',
      completed: true
    }, {
      title: 'In Process',
      time: '05 June, 3:00 PM',
      completed: true
    }, {
      title: 'Ready for Delivery',
      time: 'Estimated 06 June',
      completed: false
    }, {
      title: 'Delivered',
      time: 'Pending',
      completed: false
    }]
  }];

  const openTracking = (order: any) => {
    setSelectedOrder(order);
    setTrackingOpen(true);
  };

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">My Orders</h1>
        <p className="text-white/70">Track and view your laundry orders</p>
      </div>

      {/* Order List */}
      <div className="space-y-4">
        {orders.map(order => (
          <div key={order.id} className="glass-card p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-medium text-white">{order.id}</h3>
              <span className={`text-sm px-2 py-1 rounded-full ${order.status === 'Delivered' ? 'bg-green-600/20 text-green-400' : 'bg-yellow-600/20 text-yellow-400'}`}>
                {order.status}
              </span>
            </div>

            <div className="text-white/70 text-sm mb-3">
              <div className="flex items-center">
                <CalendarClock size={16} className="mr-2" />
                {new Date(order.date).toLocaleDateString()}
              </div>
            </div>

            <div className="border-t border-white/10 my-3"></div>

            <div className="mb-3">
              <p className="text-white text-sm mb-1">Items:</p>
              <ul className="text-white/70 text-sm space-y-1">
                {order.items.map((item, idx) => (
                  <li key={idx} className="flex justify-between">
                    <span>{item.name} ({item.quantity})</span>
                    <span>{item.price}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-between text-white mb-3">
              <span>Total</span>
              <span className="font-bold">{order.total}</span>
            </div>

            <Button onClick={() => openTracking(order)} className="w-full bg-blue-900 hover:bg-blue-800 text-white">
              Track Order
            </Button>
          </div>
        ))}
      </div>

      {/* Order Tracking Sheet */}
      <Sheet open={trackingOpen} onOpenChange={setTrackingOpen}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Order Tracking</SheetTitle>
          </SheetHeader>
          
          {selectedOrder && (
            <div className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{selectedOrder.id}</h3>
                  <p className="text-sm text-gray-500">{new Date(selectedOrder.date).toLocaleDateString()}</p>
                </div>
                <span className={`text-sm px-2 py-1 rounded-full ${selectedOrder.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {selectedOrder.status}
                </span>
              </div>

              {/* Timeline */}
              <div className="relative mt-8 ml-4">
                {selectedOrder.trackingSteps.map((step: any, index: number) => (
                  <div key={index} className="mb-8 flex">
                    {/* Circle with specific icon */}
                    <div className={`-ml-3.5 h-7 w-7 rounded-full border-2 flex items-center justify-center ${step.completed ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'}`}>
                      {step.completed ? getStepIcon(step.title, step.completed) : <div className="h-3 w-3 bg-gray-300 rounded-full"></div>}
                    </div>
                    
                    {/* Content */}
                    <div className="ml-4">
                      <h4 className={`text-base font-medium ${step.completed ? 'text-gray-900' : 'text-gray-500'}`}>{step.title}</h4>
                      <p className="text-sm text-gray-500">{step.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Order Summary</h4>
                {selectedOrder.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{item.name} ({item.quantity})</span>
                    <span>{item.price}</span>
                  </div>
                ))}
                <div className="border-t border-gray-200 my-2 pt-2 flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-blue-600">{selectedOrder.total}</span>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </AppLayout>
  );
};

export default OrdersPage;

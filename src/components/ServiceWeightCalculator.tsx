
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calculator, Save } from 'lucide-react';

interface ServiceWeightCalculatorProps {
  orderId: string;
  orderItems: any[];
  currentFinalWeight?: number;
  currentFinalPrice?: number;
  onSave: (weight: number, price: number) => Promise<boolean>;
  isUpdating: boolean;
}

const ServiceWeightCalculator: React.FC<ServiceWeightCalculatorProps> = ({
  orderId,
  orderItems,
  currentFinalWeight,
  currentFinalPrice,
  onSave,
  isUpdating
}) => {
  const [itemWeights, setItemWeights] = useState<Record<string, number>>({});
  const [calculatedWeight, setCalculatedWeight] = useState(currentFinalWeight || 0);
  const [calculatedPrice, setCalculatedPrice] = useState(currentFinalPrice || 0);

  // Service-based weight guidelines
  const serviceWeightGuidelines = {
    'bedsheet': { min: 0.8, max: 1.5, unit: 'per piece' },
    'shirt': { min: 0.2, max: 0.4, unit: 'per piece' },
    'pants': { min: 0.3, max: 0.6, unit: 'per piece' },
    'dress': { min: 0.4, max: 0.8, unit: 'per piece' },
    'towel': { min: 0.3, max: 0.7, unit: 'per piece' },
    'blanket': { min: 1.0, max: 2.5, unit: 'per piece' },
    'normal clothes': { min: 0.2, max: 0.5, unit: 'per piece' },
    'default': { min: 0.2, max: 1.0, unit: 'per piece' }
  };

  useEffect(() => {
    // Initialize with current weights if available, otherwise use estimated weights
    const initialWeights: Record<string, number> = {};
    orderItems.forEach(item => {
      if (currentFinalWeight && orderItems.length === 1) {
        // If there's only one item and we have final weight, use it
        initialWeights[item.id] = currentFinalWeight;
      } else {
        // Use estimated weight or calculate from guidelines
        const serviceName = item.services?.name?.toLowerCase() || 'default';
        const guidelines = serviceWeightGuidelines[serviceName] || serviceWeightGuidelines.default;
        const avgWeight = (guidelines.min + guidelines.max) / 2;
        initialWeights[item.id] = item.estimated_weight || (avgWeight * item.quantity);
      }
    });
    setItemWeights(initialWeights);
  }, [orderItems, currentFinalWeight]);

  useEffect(() => {
    // Calculate total weight and price
    const totalWeight = Object.values(itemWeights).reduce((sum, weight) => sum + weight, 0);
    let totalPrice = 0;

    orderItems.forEach(item => {
      const itemWeight = itemWeights[item.id] || 0;
      const pricePerKg = item.services?.base_price_per_kg || 0;
      totalPrice += itemWeight * pricePerKg;
    });

    setCalculatedWeight(totalWeight);
    setCalculatedPrice(totalPrice);
  }, [itemWeights, orderItems]);

  const handleWeightChange = (itemId: string, weight: string) => {
    const weightValue = parseFloat(weight) || 0;
    setItemWeights(prev => ({
      ...prev,
      [itemId]: weightValue
    }));
  };

  const handleSave = async () => {
    console.log('Saving weights:', { calculatedWeight, calculatedPrice });
    const success = await onSave(calculatedWeight, calculatedPrice);
    if (success) {
      console.log('Weights saved successfully');
    }
  };

  const getServiceGuideline = (serviceName: string) => {
    const name = serviceName?.toLowerCase() || 'default';
    // Check for partial matches
    for (const [key, value] of Object.entries(serviceWeightGuidelines)) {
      if (name.includes(key)) {
        return value;
      }
    }
    return serviceWeightGuidelines.default;
  };

  return (
    <div className="space-y-4 bg-white/5 rounded-lg p-4">
      <div className="flex items-center space-x-2 mb-3">
        <Calculator className="w-5 h-5 text-white" />
        <h4 className="text-white font-medium">Service-based Weight Calculator</h4>
      </div>

      <div className="space-y-3">
        {orderItems.map(item => {
          const serviceName = item.services?.name || 'Unknown Service';
          const guidelines = getServiceGuideline(serviceName);
          
          return (
            <div key={item.id} className="bg-white/5 rounded p-3">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 space-y-2 sm:space-y-0">
                <div className="flex-1">
                  <p className="text-white font-medium text-sm">{serviceName}</p>
                  <p className="text-white/60 text-xs">
                    Quantity: {item.quantity} | Guideline: {guidelines.min}-{guidelines.max}kg {guidelines.unit}
                  </p>
                </div>
                <div className="w-full sm:w-24">
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    value={itemWeights[item.id] || ''}
                    onChange={(e) => handleWeightChange(item.id, e.target.value)}
                    placeholder="Weight (kg)"
                    className="bg-white/10 border-white/20 text-white text-sm"
                  />
                </div>
              </div>
              <div className="text-white/70 text-xs">
                Price: ₹{((itemWeights[item.id] || 0) * (item.services?.base_price_per_kg || 0)).toFixed(2)}
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t border-white/20 pt-3">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
          <div className="text-white">
            <p className="font-medium">Total Weight: {calculatedWeight.toFixed(2)} kg</p>
            <p className="font-medium">Total Price: ₹{calculatedPrice.toFixed(2)}</p>
          </div>
          <Button
            onClick={handleSave}
            disabled={isUpdating}
            className="bg-green-600 hover:bg-green-700 flex items-center space-x-2 w-full sm:w-auto"
          >
            <Save className="w-4 h-4" />
            <span>Save Weights & Price</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ServiceWeightCalculator;


import React from 'react';
import { Button } from '@/components/ui/button';
import { Home, Briefcase, MapPin } from 'lucide-react';
import { AddressLabel } from '@/types/address';

interface AddressLabelSelectorProps {
  selectedLabel: AddressLabel;
  onLabelChange: (label: AddressLabel) => void;
}

const labelConfig = {
  home: {
    label: 'Home',
    icon: Home,
    color: 'bg-green-500/20 text-green-400 border-green-400/30'
  },
  work: {
    label: 'Work', 
    icon: Briefcase,
    color: 'bg-blue-500/20 text-blue-400 border-blue-400/30'
  },
  other: {
    label: 'Other',
    icon: MapPin,
    color: 'bg-purple-500/20 text-purple-400 border-purple-400/30'
  }
};

const AddressLabelSelector = ({ selectedLabel, onLabelChange }: AddressLabelSelectorProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-white">Address Type</label>
      <div className="grid grid-cols-3 gap-2">
        {Object.entries(labelConfig).map(([key, config]) => {
          const IconComponent = config.icon;
          const isSelected = selectedLabel === key;
          
          return (
            <Button
              key={key}
              type="button"
              variant="outline"
              className={`flex flex-col items-center gap-2 h-16 border ${
                isSelected 
                  ? config.color 
                  : 'border-white/20 bg-white/5 text-white/80 hover:bg-white/10'
              } transition-all duration-200`}
              onClick={() => onLabelChange(key as AddressLabel)}
            >
              <IconComponent size={16} />
              <span className="text-xs">{config.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default AddressLabelSelector;

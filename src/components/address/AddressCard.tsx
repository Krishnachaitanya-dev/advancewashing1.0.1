
import React from 'react';
import { Button } from '@/components/ui/button';
import { Home, Briefcase, MapPin, Edit, Trash2, Star } from 'lucide-react';
import { Address } from '@/types/address';

interface AddressCardProps {
  address: Address;
  onEdit: (address: Address) => void;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
  showActions?: boolean;
  onClick?: (address: Address) => void;
}

const labelConfig = {
  home: { icon: Home, color: 'text-green-400', bg: 'bg-green-500/20' },
  work: { icon: Briefcase, color: 'text-blue-400', bg: 'bg-blue-500/20' },
  other: { icon: MapPin, color: 'text-purple-400', bg: 'bg-purple-500/20' }
};

const AddressCard = ({ 
  address, 
  onEdit, 
  onDelete, 
  onSetDefault, 
  showActions = true,
  onClick 
}: AddressCardProps) => {
  const { icon: IconComponent, color, bg } = labelConfig[address.label];

  const handleCardClick = () => {
    if (onClick) {
      onClick(address);
    }
  };

  return (
    <div 
      className={`glass-card p-4 transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:bg-white/10' : ''
      }`}
      onClick={handleCardClick}
    >
      {/* Header with label and default indicator */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-lg ${bg}`}>
            <IconComponent size={16} className={color} />
          </div>
          <div>
            <span className={`text-sm font-medium ${color} capitalize`}>
              {address.label}
            </span>
            {address.isDefault && (
              <div className="flex items-center gap-1 mt-1">
                <Star size={12} className="text-yellow-400 fill-yellow-400" />
                <span className="text-xs text-yellow-400">Default</span>
              </div>
            )}
          </div>
        </div>
        
        {showActions && (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(address);
              }}
              className="h-8 w-8 text-white/60 hover:text-white hover:bg-white/10"
            >
              <Edit size={14} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(address.id);
              }}
              className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10"
            >
              <Trash2 size={14} />
            </Button>
          </div>
        )}
      </div>

      {/* Address Details */}
      <div className="space-y-1 text-white/80">
        <p className="font-medium text-white">{address.doorNo}, {address.street}</p>
        {address.landmark && (
          <p className="text-sm text-white/60">Near {address.landmark}</p>
        )}
        <p className="text-sm">
          {address.city}, {address.state} - {address.pincode}
        </p>
        
        {/* Contact Info */}
        <div className="pt-2 border-t border-white/10">
          <p className="text-sm text-white/70">
            📞 {address.phone}
            {address.name && ` • ${address.name}`}
          </p>
        </div>
      </div>

      {/* Set Default Button */}
      {showActions && !address.isDefault && (
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onSetDefault(address.id);
          }}
          className="w-full mt-3 border-white/20 text-white/80 hover:bg-white/10"
        >
          Set as Default
        </Button>
      )}
    </div>
  );
};

export default AddressCard;

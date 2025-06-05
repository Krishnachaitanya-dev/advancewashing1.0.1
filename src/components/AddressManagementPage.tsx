import React, { useState } from 'react';
import AppLayout from './AppLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSupabaseAddresses } from '@/hooks/useSupabaseAddresses';
import AddressCard from './address/AddressCard';
import AddressForm from './address/AddressForm';
import { Address, AddressFormData } from '@/types/address';
import type { AddressFormData as SupabaseAddressFormData } from '@/hooks/useSupabaseAddresses';

type ViewMode = 'list' | 'add' | 'edit';

// Helper function to convert SupabaseAddress to Address
const convertSupabaseAddressToAddress = (supabaseAddr: any): Address => {
  return {
    id: supabaseAddr.id,
    doorNo: supabaseAddr.door_no,
    street: supabaseAddr.street,
    landmark: supabaseAddr.landmark,
    city: supabaseAddr.city,
    state: supabaseAddr.state,
    pincode: supabaseAddr.pincode,
    phone: supabaseAddr.phone,
    name: supabaseAddr.name,
    label: supabaseAddr.label,
    coordinates: supabaseAddr.coordinates,
    isDefault: supabaseAddr.is_default,
    createdAt: new Date(supabaseAddr.created_at),
    updatedAt: new Date(supabaseAddr.updated_at)
  };
};

// Helper function to convert AddressFormData to SupabaseAddressFormData
const convertToSupabaseFormData = (formData: AddressFormData): SupabaseAddressFormData => {
  return {
    door_no: formData.doorNo,
    street: formData.street,
    landmark: formData.landmark,
    city: formData.city,
    state: formData.state,
    pincode: formData.pincode,
    phone: formData.phone,
    name: formData.name,
    label: formData.label
  };
};

// Helper function to convert Address to AddressFormData
const convertAddressToFormData = (address: Address): AddressFormData => {
  return {
    doorNo: address.doorNo,
    street: address.street,
    landmark: address.landmark,
    city: address.city,
    state: address.state,
    pincode: address.pincode,
    phone: address.phone,
    name: address.name,
    label: address.label
  };
};

const AddressManagementPage = () => {
  const {
    addresses,
    isLoading,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress
  } = useSupabaseAddresses();
  
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const handleAddAddress = async (formData: AddressFormData) => {
    setFormLoading(true);
    try {
      const supabaseFormData = convertToSupabaseFormData(formData);
      await addAddress(supabaseFormData);
      setViewMode('list');
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateAddress = async (formData: AddressFormData) => {
    if (!editingAddress) return;
    setFormLoading(true);
    try {
      const supabaseFormData = convertToSupabaseFormData(formData);
      await updateAddress(editingAddress.id, supabaseFormData);
      setViewMode('list');
      setEditingAddress(null);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setViewMode('edit');
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this address?')) {
      await deleteAddress(id);
    }
  };

  const handleCancel = () => {
    setViewMode('list');
    setEditingAddress(null);
  };

  if (viewMode === 'add') {
    return (
      <AppLayout>
        <div className="space-y-6">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => setViewMode('list')} className="text-white mr-3 hover:bg-white/10">
              <ArrowLeft size={20} />
            </Button>
            <h1 className="text-xl font-semibold text-white">Add New Address</h1>
          </div>

          <div className="glass-card p-6">
            <AddressForm onSubmit={handleAddAddress} onCancel={handleCancel} isLoading={formLoading} />
          </div>
        </div>
      </AppLayout>
    );
  }

  if (viewMode === 'edit' && editingAddress) {
    const initialFormData = convertAddressToFormData(editingAddress);
    
    return (
      <AppLayout>
        <div className="space-y-6">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => setViewMode('list')} className="text-white mr-3 hover:bg-white/10">
              <ArrowLeft size={20} />
            </Button>
            <h1 className="text-xl font-semibold text-white">Edit Address</h1>
          </div>

          <div className="glass-card p-6">
            <AddressForm 
              onSubmit={handleUpdateAddress} 
              onCancel={handleCancel} 
              initialData={initialFormData} 
              isLoading={formLoading} 
            />
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/profile">
              <Button variant="ghost" size="icon" className="text-white mr-3 hover:bg-white/10">
                <ArrowLeft size={20} />
              </Button>
            </Link>
            <h1 className="text-xl font-semibold text-white">My Addresses</h1>
          </div>
          
          <Button onClick={() => setViewMode('add')} className="bg-green-500 hover:bg-green-600 text-white mx-0 my-0 py-0 px-[15px]">
            <Plus size={16} className="mr-2" />
            Add Address
          </Button>
        </div>

        {/* Address List */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="glass-card p-4 animate-pulse">
                <div className="h-4 bg-white/20 rounded mb-2"></div>
                <div className="h-3 bg-white/10 rounded mb-1"></div>
                <div className="h-3 bg-white/10 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : addresses.length === 0 ? (
          <div className="glass-card p-8 text-center">
            <MapPin size={48} className="mx-auto text-white/40 mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No addresses added yet</h3>
            <p className="text-white/70 mb-4">Add your first address to get started</p>
            <Button onClick={() => setViewMode('add')} className="bg-green-500 hover:bg-green-600 text-white">
              <Plus size={16} className="mr-2" />
              Add Your First Address
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {addresses.map(address => (
              <AddressCard 
                key={address.id} 
                address={convertSupabaseAddressToAddress(address)} 
                onEdit={handleEdit} 
                onDelete={handleDelete} 
                onSetDefault={setDefaultAddress} 
              />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default AddressManagementPage;

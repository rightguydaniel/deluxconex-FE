import { useState } from 'react';
import { FiHome, FiPlus, FiEdit2, FiTrash2, FiCheck, } from 'react-icons/fi';

enum AddressType {
  BILLING = "billing",
  SHIPPING = "shipping"
}

interface Address {
  id: string;
  type: AddressType;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  phone?: string;
  additionalInfo?: string;
}

const AdminUserAddresses = ({ userId }: { userId: string }) => {
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: 'addr-001',
      type: AddressType.SHIPPING,
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'USA',
      isDefault: true,
      phone: '+1234567890',
      additionalInfo: 'Apartment 4B'
    },
    {
      id: 'addr-002',
      type: AddressType.BILLING,
      street: '456 Business Ave',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'USA',
      isDefault: false,
      phone: '+1234567890',
      additionalInfo: 'Floor 3'
    }
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newAddress, setNewAddress] = useState<Omit<Address, 'id'>>({
    type: AddressType.SHIPPING,
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'USA',
    isDefault: false,
    phone: '',
    additionalInfo: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewAddress({
      ...newAddress,
      [name]: name === 'isDefault' ? (e.target as HTMLInputElement).checked : value
    });
  };

  const handleAddAddress = () => {
    if (newAddress.isDefault) {
      setAddresses(addresses.map(addr => ({ ...addr, isDefault: false })));
    }
    
    setAddresses([
      ...addresses,
      {
        ...newAddress,
        id: `addr-${Math.random().toString(36).substr(2, 9)}`
      }
    ]);
    setIsAdding(false);
    setNewAddress({
      type: AddressType.SHIPPING,
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'USA',
      isDefault: false,
      phone: '',
      additionalInfo: ''
    });
  };

  const handleEditAddress = (id: string) => {
    const address = addresses.find(addr => addr.id === id);
    if (address) {
      setNewAddress(address);
      setEditingId(id);
    }
  };

  const handleUpdateAddress = () => {
    if (!editingId) return;
    
    if (newAddress.isDefault) {
      setAddresses(addresses.map(addr => 
        addr.id !== editingId ? { ...addr, isDefault: false } : addr
      ));
    }
    
    setAddresses(addresses.map(addr => 
      addr.id === editingId ? { ...newAddress, id: editingId } : addr
    ));
    setEditingId(null);
    setNewAddress({
      type: AddressType.SHIPPING,
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'USA',
      isDefault: false,
      phone: '',
      additionalInfo: ''
    });
  };

  const handleRemoveAddress = (id: string) => {
    setAddresses(addresses.filter(addr => addr.id !== id));
  };

  const handleSetDefault = (id: string) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-900">User Addresses</h2>
        <button
          onClick={() => setIsAdding(true)}
          className="px-3 py-1 bg-blue-600 text-white rounded flex items-center"
          disabled={isAdding || editingId !== null}
        >
          <FiPlus className="mr-1" /> Add Address
        </button>
      </div>

      {(isAdding || editingId) && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {editingId ? 'Edit Address' : 'Add New Address'}
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address Type</label>
              <select
                name="type"
                value={newAddress.type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value={AddressType.SHIPPING}>Shipping</option>
                <option value={AddressType.BILLING}>Billing</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
              <input
                type="text"
                name="street"
                value={newAddress.street}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Street address"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={newAddress.city}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="City"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State/Province</label>
                <input
                  type="text"
                  name="state"
                  value={newAddress.state}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="State/Province"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                <input
                  type="text"
                  name="postalCode"
                  value={newAddress.postalCode}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Postal code"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <input
                  type="text"
                  name="country"
                  value={newAddress.country}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Country"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                name="phone"
                value={newAddress.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Phone number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Additional Information</label>
              <textarea
                name="additionalInfo"
                value={newAddress.additionalInfo}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Additional delivery instructions"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="isDefault"
                checked={newAddress.isDefault}
                onChange={handleInputChange}
                id="defaultAddress"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="defaultAddress" className="ml-2 block text-sm text-gray-700">
                Set as default address
              </label>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => {
                  setIsAdding(false);
                  setEditingId(null);
                  setNewAddress({
                    type: AddressType.SHIPPING,
                    street: '',
                    city: '',
                    state: '',
                    postalCode: '',
                    country: 'USA',
                    isDefault: false,
                    phone: '',
                    additionalInfo: ''
                  });
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={editingId ? handleUpdateAddress : handleAddAddress}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {editingId ? 'Update Address' : 'Save Address'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {addresses.length === 0 ? (
          <p className="text-gray-500">No addresses found for this user.</p>
        ) : (
          addresses.map((address) => (
            <div key={address.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <div className="flex items-center">
                  <FiHome className={`mr-2 ${address.isDefault ? 'text-blue-500' : 'text-gray-400'}`} />
                  <span className="font-medium capitalize">{address.type} address</span>
                  {address.isDefault && (
                    <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      Default
                    </span>
                  )}
                </div>
                <div className="flex space-x-2">
                  {!address.isDefault && (
                    <button
                      onClick={() => handleSetDefault(address.id)}
                      className="text-sm text-blue-600 hover:text-blue-800"
                      title="Set as default"
                    >
                      <FiCheck />
                    </button>
                  )}
                  <button
                    onClick={() => handleEditAddress(address.id)}
                    className="text-gray-500 hover:text-blue-600"
                    title="Edit"
                    disabled={isAdding || editingId !== null}
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    onClick={() => handleRemoveAddress(address.id)}
                    className="text-gray-500 hover:text-red-600"
                    title="Delete"
                    disabled={isAdding || editingId !== null}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <p className="text-gray-900">{address.street}</p>
                <p className="text-gray-900">
                  {address.city}, {address.state} {address.postalCode}
                </p>
                <p className="text-gray-900">{address.country}</p>
                {address.phone && (
                  <p className="text-gray-600 mt-1">Phone: {address.phone}</p>
                )}
                {address.additionalInfo && (
                  <p className="text-gray-600 mt-1">{address.additionalInfo}</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminUserAddresses;
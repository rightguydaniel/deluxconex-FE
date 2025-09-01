import { useEffect, useState } from "react";
import { FiHome, FiPlus, FiEdit2, FiTrash2, FiCheck } from "react-icons/fi";
import api from "../../services/api";

enum AddressType {
  BILLING = "billing",
  SHIPPING = "shipping",
}

interface AddressesAttributes {
  id: string;
  userId: string;
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
const AddresseBook = () => {
  const [addresses, setAddresses] = useState<AddressesAttributes[] | []>([]);
  const getAddresses = async () => {
    try {
      const response = await api.get("/user/addresses");
      setAddresses(response.data.data);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getAddresses();
  }, []);

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newAddress, setNewAddress] = useState({
    type: "shipping",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "USA",
    isDefault: true,
    phone: "",
    additionalInfo: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setNewAddress({
      ...newAddress,
      [name]:
        name === "isDefault" ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleAddAddress = async () => {
    setIsAdding(false);
    try {
      const response = await api.post("/user/addresses", newAddress);
      setAddresses([...addresses, response.data.data]);
      setNewAddress({
        type: "shipping",
        street: "",
        city: "",
        state: "",
        postalCode: "",
        country: "USA",
        isDefault: false,
        phone: "",
        additionalInfo: "",
      });
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const handleEditAddress = async (id: string) => {
    const address = addresses.find((addr) => addr.id === id);
    if (address) {
      setNewAddress({
        type: address.type,
        street: address.street,
        city: address.city,
        state: address.state,
        postalCode: address.postalCode,
        country: address.country,
        isDefault: address.isDefault,
        phone: address.phone || "",
        additionalInfo: address.additionalInfo || "",
      });
      setEditingId(id);
    }
  };

  const handleUpdateAddress = async () => {
    if (!editingId) return;

    if (newAddress.isDefault) {
      // Set all other addresses to non-default
      setAddresses(
        addresses.map((addr) =>
          addr.id !== editingId ? { ...addr, isDefault: false } : addr
        )
      );
    }
    try {
      const response = await api.put(
        `/user/addresses/${editingId}`,
        newAddress
      );
      if (response.data.status === "success") {
        setNewAddress({
          type: "shipping",
          street: "",
          city: "",
          state: "",
          postalCode: "",
          country: "USA",
          isDefault: false,
          phone: "",
          additionalInfo: "",
        });
        setEditingId(null);
        setIsAdding(false);
        getAddresses();
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const handleRemoveAddress = async (id: string) => {
    try {
      const response = await api.delete(`/user/addresses/${id}`);
      if (response.data.status === "success") {
        setAddresses(addresses.filter((addr) => addr.id !== id));
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      const response = await api.patch(`/user/addresses/${id}/default`);
      if (response.data.status === "success") {
        getAddresses();
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Addresses</h1>
        <button
          onClick={() => setIsAdding(true)}
          className="px-3 py-1 bg-blue-600 text-white rounded flex items-center"
        >
          <FiPlus className="mr-1" /> Add Address
        </button>
      </div>

      {(isAdding || editingId) && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            {editingId ? "Edit Address" : "Add New Address"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address Type
              </label>
              <select
                name="type"
                value={newAddress.type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="shipping">Shipping</option>
                <option value="billing">Billing</option>
              </select>
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
              <label
                htmlFor="defaultAddress"
                className="ml-2 block text-sm text-gray-700"
              >
                Set as default address
              </label>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Street Address
            </label>
            <input
              type="text"
              name="street"
              value={newAddress.street}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                name="city"
                value={newAddress.city}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State/Province
              </label>
              <input
                type="text"
                name="state"
                value={newAddress.state}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Postal Code
              </label>
              <input
                type="text"
                name="postalCode"
                value={newAddress.postalCode}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <input
                type="text"
                name="country"
                value={newAddress.country}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={newAddress.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Information
            </label>
            <textarea
              name="additionalInfo"
              value={newAddress.additionalInfo}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={() => {
                setIsAdding(false);
                setEditingId(null);
                setNewAddress({
                  type: "shipping",
                  street: "",
                  city: "",
                  state: "",
                  postalCode: "",
                  country: "USA",
                  isDefault: false,
                  phone: "",
                  additionalInfo: "",
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
              {editingId ? "Update Address" : "Save Address"}
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {addresses.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600">You haven't saved any addresses yet</p>
          </div>
        ) : (
          addresses.map((address) => (
            <div
              key={address.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <div className="flex items-center">
                  <FiHome
                    className={`mr-2 ${
                      address.isDefault ? "text-blue-500" : "text-gray-400"
                    }`}
                  />
                  <span className="font-medium capitalize">
                    {address.type} address
                  </span>
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
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    onClick={() => handleRemoveAddress(address.id)}
                    className="text-gray-500 hover:text-red-600"
                    title="Delete"
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
                {address.additionalInfo && (
                  <p className="text-gray-600 mt-1">{address.additionalInfo}</p>
                )}
                {address.phone && (
                  <p className="text-gray-600 mt-1">Phone: {address.phone}</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AddresseBook;

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { FiHome, FiPlus, FiEdit2, FiTrash2, FiCheck } from "react-icons/fi";
import api from "../../services/api";

enum AddressType {
  BILLING = "billing",
  SHIPPING = "shipping",
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

type AddressFormState = Omit<Address, "id">;

const DEFAULT_FORM: AddressFormState = {
  type: AddressType.SHIPPING,
  street: "",
  city: "",
  state: "",
  postalCode: "",
  country: "USA",
  isDefault: false,
  phone: "",
  additionalInfo: "",
};

const getErrorMessage = (error: unknown) => {
  if (
    error &&
    typeof error === "object" &&
    "response" in error &&
    (error as any).response?.data
  ) {
    const data = (error as any).response.data;
    return data.message || data.errorMessage || "An unexpected error occurred.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred.";
};

const AdminUserAddresses = ({ userId }: { userId: string }) => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formState, setFormState] = useState<AddressFormState>({
    ...DEFAULT_FORM,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [settingDefaultId, setSettingDefaultId] = useState<string | null>(null);

  const resetForm = useCallback(() => {
    setFormState({ ...DEFAULT_FORM });
    setIsAdding(false);
    setEditingId(null);
  }, []);

  const fetchAddresses = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/admin/users/${userId}/addresses`);
      setAddresses(response.data?.data ?? []);
    } catch (error) {
      setAlert({ type: "error", message: getErrorMessage(error) });
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchAddresses();
    }
  }, [fetchAddresses, userId]);

  const handleInputChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const target = event.target as
      | (EventTarget & HTMLInputElement)
      | (EventTarget & HTMLSelectElement)
      | (EventTarget & HTMLTextAreaElement);

    const { name, value } = target;

    let nextValue: string | boolean = value;

    if (target instanceof HTMLInputElement && target.type === "checkbox") {
      nextValue = target.checked;
    }

    setFormState((prev) => ({
      ...prev,
      [name]: nextValue,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setAlert(null);

    try {
      const payload = { ...formState };

      if (editingId) {
        await api.put(
          `/admin/users/${userId}/addresses/${editingId}`,
          payload
        );
        setAlert({ type: "success", message: "Address updated successfully." });
      } else {
        await api.post(`/admin/users/${userId}/addresses`, payload);
        setAlert({ type: "success", message: "Address added successfully." });
      }

      await fetchAddresses();
      resetForm();
    } catch (error) {
      setAlert({ type: "error", message: getErrorMessage(error) });
    } finally {
      setSaving(false);
    }
  };

  const handleEditAddress = (address: Address) => {
    setFormState({
      type: address.type,
      street: address.street,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      isDefault: address.isDefault,
      phone: address.phone ?? "",
      additionalInfo: address.additionalInfo ?? "",
    });
    setEditingId(address.id);
    setIsAdding(false);
    setAlert(null);
  };

  const handleDeleteAddress = async (addressId: string) => {
    setDeletingId(addressId);
    setAlert(null);
    try {
      await api.delete(`/admin/users/${userId}/addresses/${addressId}`);
      setAddresses((prev) => prev.filter((address) => address.id !== addressId));
      setAlert({ type: "success", message: "Address removed." });
    } catch (error) {
      setAlert({ type: "error", message: getErrorMessage(error) });
    } finally {
      setDeletingId(null);
    }
  };

  const handleSetDefault = async (addressId: string) => {
    setSettingDefaultId(addressId);
    setAlert(null);
    try {
      await api.patch(
        `/admin/users/${userId}/addresses/${addressId}/default`
      );
      setAddresses((prev) =>
        prev.map((address) => ({
          ...address,
          isDefault: address.id === addressId,
        }))
      );
      setAlert({ type: "success", message: "Default address updated." });
    } catch (error) {
      setAlert({ type: "error", message: getErrorMessage(error) });
    } finally {
      setSettingDefaultId(null);
    }
  };

  const formTitle = useMemo(() => {
    if (editingId) {
      return "Edit Address";
    }
    if (isAdding) {
      return "Add New Address";
    }
    return "";
  }, [editingId, isAdding]);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-900">User Addresses</h2>
        <button
          onClick={() => {
            setIsAdding(true);
            setEditingId(null);
            setFormState({ ...DEFAULT_FORM });
          }}
          className="px-3 py-1 bg-blue-600 text-white rounded flex items-center disabled:opacity-60"
          disabled={isAdding || editingId !== null || isLoading}
        >
          <FiPlus className="mr-1" /> Add Address
        </button>
      </div>

      {alert && (
        <div
          className={`mb-4 rounded-md px-4 py-2 text-sm ${
            alert.type === "success"
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {alert.message}
        </div>
      )}

      {(isAdding || editingId) && (
        <form
          className="bg-white rounded-lg shadow-md p-6 mb-6"
          onSubmit={handleSubmit}
        >
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {formTitle}
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address Type
              </label>
              <select
                name="type"
                value={formState.type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value={AddressType.SHIPPING}>Shipping</option>
                <option value={AddressType.BILLING}>Billing</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Street Address
              </label>
              <input
                type="text"
                name="street"
                value={formState.street}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Street address"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formState.city}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="City"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State/Province
                </label>
                <input
                  type="text"
                  name="state"
                  value={formState.state}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="State"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Postal Code
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={formState.postalCode}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Postal code"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={formState.country}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Country"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone (optional)
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formState.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Contact phone"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Info (optional)
                </label>
                <textarea
                  name="additionalInfo"
                  value={formState.additionalInfo}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Apartment, suite, etc."
                  rows={2}
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="isDefault"
                checked={formState.isDefault}
                onChange={handleInputChange}
                id="isDefaultAddress"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="isDefaultAddress"
                className="ml-2 block text-sm text-gray-700"
              >
                Set as default address
              </label>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-70"
                disabled={saving}
              >
                {saving ? "Saving..." : editingId ? "Update Address" : "Add Address"}
              </button>
            </div>
          </div>
        </form>
      )}

      {isLoading ? (
        <p className="text-gray-500">Loading addresses...</p>
      ) : addresses.length === 0 ? (
        <p className="text-gray-500">No addresses found for this user.</p>
      ) : (
        <div className="space-y-4">
          {addresses.map((address) => (
            <div key={address.id} className="bg-white rounded-lg shadow-md p-4">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center">
                  <FiHome className="text-gray-500 mr-2" />
                  <div>
                    <p className="font-medium text-gray-900 capitalize">
                      {address.type} address
                    </p>
                    <p className="text-sm text-gray-500">
                      {address.street}, {address.city}, {address.state} {address.postalCode}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {!address.isDefault && (
                    <button
                      onClick={() => handleSetDefault(address.id)}
                      className="px-3 py-1 text-sm text-blue-600 border border-blue-200 rounded hover:bg-blue-50 disabled:opacity-60"
                      disabled={settingDefaultId === address.id}
                    >
                      {settingDefaultId === address.id ? "Setting..." : "Set Default"}
                    </button>
                  )}
                  <button
                    onClick={() => handleEditAddress(address)}
                    className="px-3 py-1 text-sm text-gray-600 border border-gray-200 rounded hover:bg-gray-50"
                    disabled={isAdding || editingId === address.id}
                  >
                    <FiEdit2 className="inline mr-1" /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteAddress(address.id)}
                    className="px-3 py-1 text-sm text-red-600 border border-red-200 rounded hover:bg-red-50 disabled:opacity-60"
                    disabled={deletingId === address.id}
                  >
                    {deletingId === address.id ? "Deleting..." : (
                      <>
                        <FiTrash2 className="inline mr-1" /> Delete
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="text-sm text-gray-600 space-y-1">
                {address.phone && <p>Phone: {address.phone}</p>}
                {address.additionalInfo && <p>Info: {address.additionalInfo}</p>}
                {address.isDefault && (
                  <span className="inline-flex items-center rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                    <FiCheck className="mr-1" /> Default address
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminUserAddresses;

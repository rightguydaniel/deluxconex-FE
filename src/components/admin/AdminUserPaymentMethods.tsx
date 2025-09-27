import { useCallback, useEffect, useState } from "react";
import { FiEdit2, FiTrash2, FiCheck, FiEye, FiEyeOff } from "react-icons/fi";
import api from "../../services/api";

enum CardType {
  VISA = "visa",
  MASTERCARD = "mastercard",
  AMEX = "amex",
  DISCOVER = "discover",
  JCB = "jcb",
  DINERS_CLUB = "diners_club",
  OTHER = "other",
}

interface BillingAddress {
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

interface PaymentMethod {
  id: string;
  isDefault: boolean;
  cardType: CardType;
  cardholderName: string;
  lastFourDigits: string;
  expiryMonth: number;
  expiryYear: number;
  billingAddress?: BillingAddress | null;
}

const getCardIcon = (cardType: CardType) => {
  switch (cardType) {
    case CardType.VISA:
      return "/icons/visa.svg";
    case CardType.MASTERCARD:
      return "/icons/mastercard.svg";
    case CardType.AMEX:
      return "/icons/amex.svg";
    case CardType.DISCOVER:
      return "/icons/discover.svg";
    case CardType.JCB:
      return "/icons/jcb.svg";
    case CardType.DINERS_CLUB:
      return "/icons/diners-club.svg";
    default:
      return "/icons/credit-card.svg";
  }
};

const formatExpiryDate = (month: number, year: number) =>
  `${month.toString().padStart(2, "0")}/${year.toString().slice(-2)}`;

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

const AdminUserPaymentMethods = ({ userId }: { userId: string }) => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [showFullCard, setShowFullCard] = useState<Record<string, boolean>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(
    null
  );
  const [saving, setSaving] = useState(false);
  const [updatingDefaultId, setUpdatingDefaultId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchPaymentMethods = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/admin/users/${userId}/payment-methods`);
      const fetched: PaymentMethod[] = response.data?.data ?? [];
      setPaymentMethods(fetched);
    } catch (error) {
      setAlert({ type: "error", message: getErrorMessage(error) });
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchPaymentMethods();
    }
  }, [fetchPaymentMethods, userId]);

  const toggleShowFullCard = (id: string) => {
    setShowFullCard((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSetDefault = async (id: string) => {
    setUpdatingDefaultId(id);
    setAlert(null);
    try {
      await api.patch(`/admin/users/${userId}/payment-methods/${id}/default`);
      setPaymentMethods((prev) =>
        prev.map((method) => ({
          ...method,
          isDefault: method.id === id,
        }))
      );
      setAlert({ type: "success", message: "Default payment method updated." });
    } catch (error) {
      setAlert({ type: "error", message: getErrorMessage(error) });
    } finally {
      setUpdatingDefaultId(null);
    }
  };

  const handleRemovePaymentMethod = async (id: string) => {
    setDeletingId(id);
    setAlert(null);
    try {
      await api.delete(`/admin/users/${userId}/payment-methods/${id}`);
      setPaymentMethods((prev) => prev.filter((method) => method.id !== id));
      setAlert({ type: "success", message: "Payment method removed." });
    } catch (error) {
      setAlert({ type: "error", message: getErrorMessage(error) });
    } finally {
      setDeletingId(null);
    }
  };

  const handleEditPaymentMethod = (method: PaymentMethod) => {
    setEditingMethod({ ...method });
    setIsEditing(true);
    setAlert(null);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingMethod(null);
  };

  const handleBillingAddressChange = (
    field: keyof BillingAddress,
    value: string
  ) => {
    if (!editingMethod) {
      return;
    }

    setEditingMethod({
      ...editingMethod,
      billingAddress: {
        ...(editingMethod.billingAddress ?? {}),
        [field]: value,
      },
    });
  };

  const handleSaveEdit = async () => {
    if (!editingMethod) {
      return;
    }

    setSaving(true);
    setAlert(null);
    try {
      const payload = {
        cardholderName: editingMethod.cardholderName,
        expiryMonth: editingMethod.expiryMonth,
        expiryYear: editingMethod.expiryYear,
        billingAddress: editingMethod.billingAddress,
        isDefault: editingMethod.isDefault,
      };

      const response = await api.put(
        `/admin/users/${userId}/payment-methods/${editingMethod.id}`,
        payload
      );

      const updated: PaymentMethod = response.data?.data ?? editingMethod;

      setPaymentMethods((prev) => {
        const next = prev.map((method) =>
          method.id === updated.id ? { ...method, ...updated } : method
        );

        if (updated.isDefault) {
          return next.map((method) => ({
            ...method,
            isDefault: method.id === updated.id,
          }));
        }

        return next;
      });

      setAlert({ type: "success", message: "Payment method updated." });
      setIsEditing(false);
      setEditingMethod(null);
      fetchPaymentMethods();
    } catch (error) {
      setAlert({ type: "error", message: getErrorMessage(error) });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-900">Payment Methods</h2>
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

      {isEditing && editingMethod ? (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Edit Payment Method
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cardholder Name
              </label>
              <input
                type="text"
                value={editingMethod.cardholderName}
                onChange={(event) =>
                  setEditingMethod({
                    ...editingMethod,
                    cardholderName: event.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiration Date
                </label>
                <div className="flex space-x-2">
                  <select
                    value={editingMethod.expiryMonth}
                    onChange={(event) =>
                      setEditingMethod({
                        ...editingMethod,
                        expiryMonth: parseInt(event.target.value, 10),
                      })
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                  >
                    {Array.from({ length: 12 }, (_, index) => index + 1).map((month) => (
                      <option key={month} value={month}>
                        {month.toString().padStart(2, "0")}
                      </option>
                    ))}
                  </select>
                  <select
                    value={editingMethod.expiryYear}
                    onChange={(event) =>
                      setEditingMethod({
                        ...editingMethod,
                        expiryYear: parseInt(event.target.value, 10),
                      })
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                  >
                    {Array.from({ length: 15 }, (_, index) => new Date().getFullYear() + index).map(
                      (year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Card Type
                </label>
                <select
                  value={editingMethod.cardType}
                  onChange={(event) =>
                    setEditingMethod({
                      ...editingMethod,
                      cardType: event.target.value as CardType,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  {Object.values(CardType).map((type) => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1).replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-2">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Billing Address</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  value={editingMethod.billingAddress?.street ?? ""}
                  onChange={(event) =>
                    handleBillingAddressChange("street", event.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Street address"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={editingMethod.billingAddress?.city ?? ""}
                    onChange={(event) =>
                      handleBillingAddressChange("city", event.target.value)
                    }
                    className="px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="City"
                  />
                  <input
                    type="text"
                    value={editingMethod.billingAddress?.state ?? ""}
                    onChange={(event) =>
                      handleBillingAddressChange("state", event.target.value)
                    }
                    className="px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="State/Province"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={editingMethod.billingAddress?.postalCode ?? ""}
                    onChange={(event) =>
                      handleBillingAddressChange("postalCode", event.target.value)
                    }
                    className="px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Postal code"
                  />
                  <input
                    type="text"
                    value={editingMethod.billingAddress?.country ?? ""}
                    onChange={(event) =>
                      handleBillingAddressChange("country", event.target.value)
                    }
                    className="px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Country"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center pt-2">
              <input
                type="checkbox"
                checked={editingMethod.isDefault}
                onChange={(event) =>
                  setEditingMethod({
                    ...editingMethod,
                    isDefault: event.target.checked,
                  })
                }
                id="defaultPaymentMethod"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="defaultPaymentMethod"
                className="ml-2 block text-sm text-gray-700"
              >
                Set as default payment method
              </label>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-70"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      ) : isLoading ? (
        <p className="text-gray-500">Loading payment methods...</p>
      ) : paymentMethods.length === 0 ? (
        <p className="text-gray-500">No payment methods found for this user.</p>
      ) : (
        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <div key={method.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <div className="flex items-center">
                  <img
                    src={getCardIcon(method.cardType)}
                    alt={method.cardType}
                    className="h-6 w-6 mr-3"
                  />
                  <span className="font-medium">
                    {method.cardType.charAt(0).toUpperCase() +
                      method.cardType.slice(1).replace("_", " ")}
                  </span>
                  {method.isDefault && (
                    <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      Default
                    </span>
                  )}
                </div>
                <div className="flex space-x-2">
                  {!method.isDefault && (
                    <button
                      onClick={() => handleSetDefault(method.id)}
                      className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-60"
                      title="Set as default"
                      disabled={updatingDefaultId === method.id}
                    >
                      {updatingDefaultId === method.id ? "Setting..." : <FiCheck />}
                    </button>
                  )}
                  <button
                    onClick={() => toggleShowFullCard(method.id)}
                    className="text-gray-500 hover:text-blue-600"
                    title={
                      showFullCard[method.id] ? "Hide details" : "Show details"
                    }
                  >
                    {showFullCard[method.id] ? <FiEyeOff /> : <FiEye />}
                  </button>
                  <button
                    onClick={() => handleEditPaymentMethod(method)}
                    className="text-gray-500 hover:text-blue-600"
                    title="Edit"
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    onClick={() => handleRemovePaymentMethod(method.id)}
                    className="text-gray-500 hover:text-red-600 disabled:opacity-60"
                    title="Delete"
                    disabled={deletingId === method.id}
                  >
                    {deletingId === method.id ? "Deleting..." : <FiTrash2 />}
                  </button>
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-gray-900 font-medium">
                    {showFullCard[method.id]
                      ? `•••• •••• •••• ${method.lastFourDigits}`
                      : `•••• ${method.lastFourDigits}`}
                  </p>
                  <p className="text-gray-600">
                    Expires {formatExpiryDate(method.expiryMonth, method.expiryYear)}
                  </p>
                </div>
                <p className="text-gray-900">{method.cardholderName}</p>

                {showFullCard[method.id] && method.billingAddress && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      Billing Address
                    </p>
                    <p className="text-gray-900">{method.billingAddress.street ?? ""}</p>
                    <p className="text-gray-900">
                      {[method.billingAddress.city, method.billingAddress.state]
                        .filter(Boolean)
                        .join(", ")}{" "}
                      {method.billingAddress.postalCode ?? ""}
                    </p>
                    <p className="text-gray-900">{method.billingAddress.country ?? ""}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminUserPaymentMethods;

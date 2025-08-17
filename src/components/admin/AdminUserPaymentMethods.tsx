import { useState } from "react";
import {
  FiEdit2,
  FiTrash2,
  FiCheck,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";

enum CardType {
  VISA = "visa",
  MASTERCARD = "mastercard",
  AMEX = "amex",
  DISCOVER = "discover",
  JCB = "jcb",
  DINERS_CLUB = "diners_club",
  OTHER = "other",
}

interface PaymentMethod {
  id: string;
  isDefault: boolean;
  cardType: CardType;
  cardholderName: string;
  lastFourDigits: string;
  expiryMonth: number;
  expiryYear: number;
  billingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

const AdminUserPaymentMethods = ({ userId }: { userId: string }) => {
  console.log(userId)

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: "pm-001",
      isDefault: true,
      cardType: CardType.VISA,
      cardholderName: "John Doe",
      lastFourDigits: "4242",
      expiryMonth: 12,
      expiryYear: 2025,
      billingAddress: {
        street: "123 Main St",
        city: "New York",
        state: "NY",
        postalCode: "10001",
        country: "USA",
      },
    },
    {
      id: "pm-002",
      isDefault: false,
      cardType: CardType.MASTERCARD,
      cardholderName: "John Doe",
      lastFourDigits: "5555",
      expiryMonth: 6,
      expiryYear: 2024,
      billingAddress: {
        street: "123 Main St",
        city: "New York",
        state: "NY",
        postalCode: "10001",
        country: "USA",
      },
    },
  ]);

  const [showFullCard, setShowFullCard] = useState<Record<string, boolean>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(
    null
  );

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

  const formatExpiryDate = (month: number, year: number) => {
    return `${month.toString().padStart(2, "0")}/${year.toString().slice(-2)}`;
  };

  const toggleShowFullCard = (id: string) => {
    setShowFullCard((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSetDefault = (id: string) => {
    setPaymentMethods(
      paymentMethods.map((pm) => ({
        ...pm,
        isDefault: pm.id === id,
      }))
    );
  };

  const handleRemovePaymentMethod = (id: string) => {
    setPaymentMethods(paymentMethods.filter((pm) => pm.id !== id));
  };

  const handleEditPaymentMethod = (method: PaymentMethod) => {
    setEditingMethod(method);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (!editingMethod) return;
    setPaymentMethods(
      paymentMethods.map((pm) =>
        pm.id === editingMethod.id ? editingMethod : pm
      )
    );
    setIsEditing(false);
    setEditingMethod(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-900">Payment Methods</h2>
      </div>

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
                onChange={(e) =>
                  setEditingMethod({
                    ...editingMethod,
                    cardholderName: e.target.value,
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
                    onChange={(e) =>
                      setEditingMethod({
                        ...editingMethod,
                        expiryMonth: parseInt(e.target.value),
                      })
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(
                      (month) => (
                        <option key={month} value={month}>
                          {month.toString().padStart(2, "0")}
                        </option>
                      )
                    )}
                  </select>
                  <select
                    value={editingMethod.expiryYear}
                    onChange={(e) =>
                      setEditingMethod({
                        ...editingMethod,
                        expiryYear: parseInt(e.target.value),
                      })
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                  >
                    {Array.from(
                      { length: 10 },
                      (_, i) => new Date().getFullYear() + i
                    ).map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Card Type
                </label>
                <select
                  value={editingMethod.cardType}
                  onChange={(e) =>
                    setEditingMethod({
                      ...editingMethod,
                      cardType: e.target.value as CardType,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  {Object.values(CardType).map((type) => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() +
                        type.slice(1).replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {editingMethod.billingAddress && (
              <div className="pt-2">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Billing Address
                </h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editingMethod.billingAddress.street}
                    onChange={(e) =>
                      setEditingMethod({
                        ...editingMethod,
                        billingAddress: {
                          ...editingMethod.billingAddress,
                          street: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Street address"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={editingMethod.billingAddress.city}
                      onChange={(e) =>
                        setEditingMethod({
                          ...editingMethod,
                          billingAddress: {
                            ...editingMethod.billingAddress,
                            city: e.target.value,
                          },
                        })
                      }
                      className="px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="City"
                    />
                    <input
                      type="text"
                      value={editingMethod.billingAddress.state}
                      onChange={(e) =>
                        setEditingMethod({
                          ...editingMethod,
                          billingAddress: {
                            ...editingMethod.billingAddress,
                            state: e.target.value,
                          },
                        })
                      }
                      className="px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="State/Province"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={editingMethod.billingAddress.postalCode}
                      onChange={(e) =>
                        setEditingMethod({
                          ...editingMethod,
                          billingAddress: {
                            ...editingMethod.billingAddress,
                            postalCode: e.target.value,
                          },
                        })
                      }
                      className="px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Postal code"
                    />
                    <input
                      type="text"
                      value={editingMethod.billingAddress.country}
                      onChange={(e) =>
                        setEditingMethod({
                          ...editingMethod,
                          billingAddress: {
                            ...editingMethod.billingAddress,
                            country: e.target.value,
                          },
                        })
                      }
                      className="px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Country"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center pt-2">
              <input
                type="checkbox"
                checked={editingMethod.isDefault}
                onChange={(e) =>
                  setEditingMethod({
                    ...editingMethod,
                    isDefault: e.target.checked,
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
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {paymentMethods.length === 0 ? (
            <p className="text-gray-500">
              No payment methods found for this user.
            </p>
          ) : (
            paymentMethods.map((method) => (
              <div
                key={method.id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
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
                        className="text-sm text-blue-600 hover:text-blue-800"
                        title="Set as default"
                      >
                        <FiCheck />
                      </button>
                    )}
                    <button
                      onClick={() => toggleShowFullCard(method.id)}
                      className="text-gray-500 hover:text-blue-600"
                      title={
                        showFullCard[method.id]
                          ? "Hide details"
                          : "Show details"
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
                      className="text-gray-500 hover:text-red-600"
                      title="Delete"
                    >
                      <FiTrash2 />
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
                      Expires{" "}
                      {formatExpiryDate(method.expiryMonth, method.expiryYear)}
                    </p>
                  </div>
                  <p className="text-gray-900">{method.cardholderName}</p>

                  {showFullCard[method.id] && method.billingAddress && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        Billing Address
                      </p>
                      <p className="text-gray-900">
                        {method.billingAddress.street}
                      </p>
                      <p className="text-gray-900">
                        {method.billingAddress.city},{" "}
                        {method.billingAddress.state}{" "}
                        {method.billingAddress.postalCode}
                      </p>
                      <p className="text-gray-900">
                        {method.billingAddress.country}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AdminUserPaymentMethods;

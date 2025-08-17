import { useState } from "react";
import {
  FiCreditCard,
  FiPlus,
  FiTrash2,
  FiCheck,
  FiEye,
  FiEyeOff,
  FiLock,
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
  billingAddress?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  createdAt: string;
}

const PaymentMethods = () => {
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
      createdAt: "2023-01-15T10:30:00Z",
    },
    {
      id: "pm-002",
      isDefault: false,
      cardType: CardType.MASTERCARD,
      cardholderName: "John Doe",
      lastFourDigits: "5555",
      expiryMonth: 6,
      expiryYear: 2024,
      createdAt: "2023-03-20T14:15:00Z",
    },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [showFullCard, setShowFullCard] = useState<Record<string, boolean>>({});
  const [newPaymentMethod, setNewPaymentMethod] = useState({
    cardType: CardType.VISA,
    cardholderName: "",
    cardNumber: "",
    expiryMonth: new Date().getMonth() + 1,
    expiryYear: new Date().getFullYear(),
    cvv: "",
    isDefault: false,
    billingAddress: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "USA",
    },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name.startsWith("billingAddress.")) {
      const field = name.split(".")[1];
      setNewPaymentMethod({
        ...newPaymentMethod,
        billingAddress: {
          ...newPaymentMethod.billingAddress,
          [field]: value,
        },
      });
    } else {
      setNewPaymentMethod({
        ...newPaymentMethod,
        [name]:
          name === "isDefault" ? (e.target as HTMLInputElement).checked : value,
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!newPaymentMethod.cardholderName.trim()) {
      newErrors.cardholderName = "Cardholder name is required";
    }

    if (!newPaymentMethod.cardNumber.replace(/\s/g, "").match(/^\d{13,16}$/)) {
      newErrors.cardNumber = "Invalid card number";
    }

    if (!newPaymentMethod.cvv.match(/^\d{3,4}$/)) {
      newErrors.cvv = "Invalid CVV";
    }

    if (
      newPaymentMethod.expiryYear < new Date().getFullYear() ||
      (newPaymentMethod.expiryYear === new Date().getFullYear() &&
        newPaymentMethod.expiryMonth < new Date().getMonth() + 1)
    ) {
      newErrors.expiryMonth = "Card is expired";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddPaymentMethod = () => {
    if (!validateForm()) return;

    const lastFourDigits = newPaymentMethod.cardNumber.slice(-4);
    const newMethod: PaymentMethod = {
      id: `pm-${Math.random().toString(36).substr(2, 9)}`,
      isDefault: newPaymentMethod.isDefault,
      cardType: newPaymentMethod.cardType as CardType,
      cardholderName: newPaymentMethod.cardholderName,
      lastFourDigits,
      expiryMonth: parseInt(newPaymentMethod.expiryMonth as unknown as string),
      expiryYear: parseInt(newPaymentMethod.expiryYear as unknown as string),
      billingAddress: newPaymentMethod.billingAddress,
      createdAt: new Date().toISOString(),
    };

    if (newPaymentMethod.isDefault) {
      setPaymentMethods(
        paymentMethods.map((pm) => ({ ...pm, isDefault: false }))
      );
    }

    setPaymentMethods([...paymentMethods, newMethod]);
    setIsAdding(false);
    setNewPaymentMethod({
      cardType: CardType.VISA,
      cardholderName: "",
      cardNumber: "",
      expiryMonth: new Date().getMonth() + 1,
      expiryYear: new Date().getFullYear(),
      cvv: "",
      isDefault: false,
      billingAddress: {
        street: "",
        city: "",
        state: "",
        postalCode: "",
        country: "USA",
      },
    });
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

  const formatCardNumber = (number: string) => {
    return number
      .replace(/\s/g, "")
      .replace(/(\d{4})/g, "$1 ")
      .trim();
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Payment Methods</h1>
        <button
          onClick={() => setIsAdding(true)}
          className="px-3 py-1 bg-blue-600 text-white rounded flex items-center"
          disabled={isAdding}
        >
          <FiPlus className="mr-1" /> Add Payment Method
        </button>
      </div>

      {isAdding && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Add New Payment Method
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Card Type
              </label>
              <select
                name="cardType"
                value={newPaymentMethod.cardType}
                onChange={handleInputChange}
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cardholder Name
              </label>
              <input
                type="text"
                name="cardholderName"
                value={newPaymentMethod.cardholderName}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border ${
                  errors.cardholderName ? "border-red-500" : "border-gray-300"
                } rounded-md`}
                placeholder="Name on card"
              />
              {errors.cardholderName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.cardholderName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Card Number
              </label>
              <input
                type="text"
                name="cardNumber"
                value={formatCardNumber(newPaymentMethod.cardNumber)}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  setNewPaymentMethod({
                    ...newPaymentMethod,
                    cardNumber: value,
                  });
                }}
                className={`w-full px-3 py-2 border ${
                  errors.cardNumber ? "border-red-500" : "border-gray-300"
                } rounded-md`}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
              />
              {errors.cardNumber && (
                <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiration Date
                </label>
                <div className="flex space-x-2">
                  <select
                    name="expiryMonth"
                    value={newPaymentMethod.expiryMonth}
                    onChange={handleInputChange}
                    className={`flex-1 px-3 py-2 border ${
                      errors.expiryMonth ? "border-red-500" : "border-gray-300"
                    } rounded-md`}
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
                    name="expiryYear"
                    value={newPaymentMethod.expiryYear}
                    onChange={handleInputChange}
                    className={`flex-1 px-3 py-2 border ${
                      errors.expiryMonth ? "border-red-500" : "border-gray-300"
                    } rounded-md`}
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
                {errors.expiryMonth && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.expiryMonth}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Security Code (CVV)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="cvv"
                    value={newPaymentMethod.cvv}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      setNewPaymentMethod({ ...newPaymentMethod, cvv: value });
                    }}
                    className={`w-full px-3 py-2 border ${
                      errors.cvv ? "border-red-500" : "border-gray-300"
                    } rounded-md`}
                    placeholder="123"
                    maxLength={4}
                  />
                  <FiLock className="absolute right-3 top-3 text-gray-400" />
                </div>
                {errors.cvv && (
                  <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>
                )}
              </div>
            </div>

            <div className="pt-2">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Billing Address
              </h3>
              <div className="space-y-3">
                <input
                  type="text"
                  name="billingAddress.street"
                  value={newPaymentMethod.billingAddress.street}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Street address"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    name="billingAddress.city"
                    value={newPaymentMethod.billingAddress.city}
                    onChange={handleInputChange}
                    className="px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="City"
                  />
                  <input
                    type="text"
                    name="billingAddress.state"
                    value={newPaymentMethod.billingAddress.state}
                    onChange={handleInputChange}
                    className="px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="State/Province"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    name="billingAddress.postalCode"
                    value={newPaymentMethod.billingAddress.postalCode}
                    onChange={handleInputChange}
                    className="px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Postal code"
                  />
                  <input
                    type="text"
                    name="billingAddress.country"
                    value={newPaymentMethod.billingAddress.country}
                    onChange={handleInputChange}
                    className="px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Country"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center pt-2">
              <input
                type="checkbox"
                name="isDefault"
                checked={newPaymentMethod.isDefault}
                onChange={handleInputChange}
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
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddPaymentMethod}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save Payment Method
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {paymentMethods.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <FiCreditCard className="mx-auto text-gray-400 text-4xl mb-4" />
            <p className="text-gray-600 mb-4">
              You haven't saved any payment methods yet
            </p>
            <button
              onClick={() => setIsAdding(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Add Payment Method
            </button>
          </div>
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
                      showFullCard[method.id] ? "Hide details" : "Show details"
                    }
                  >
                    {showFullCard[method.id] ? <FiEyeOff /> : <FiEye />}
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
    </div>
  );
};

export default PaymentMethods;

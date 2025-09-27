import { useCallback, useEffect, useMemo, useState } from "react";
import { FiShoppingCart, FiTrash2, FiPlus, FiMinus } from "react-icons/fi";
import api from "../../services/api";

interface CartItem {
  productId: string;
  name: string;
  basePrice: number;
  quantity: number;
  image?: string;
  selectedDimension?: {
    dimension: string;
    priceAdjustment?: number;
  };
  selectedCondition?: {
    condition: string;
    priceAdjustment?: number;
  };
  selectedDelivery?: {
    method: string;
    price: number;
  };
  itemPrice: number;
  totalPrice: number;
}

interface CartPayload {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

const EMPTY_CART: CartPayload = {
  items: [],
  subtotal: 0,
  shipping: 0,
  tax: 0,
  total: 0,
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

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    value
  );

const AdminUserCart = ({ userId }: { userId: string }) => {
  const [cart, setCart] = useState<CartPayload>(EMPTY_CART);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(
    null
  );
  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);
  const [removingItemId, setRemovingItemId] = useState<string | null>(null);
  const [clearing, setClearing] = useState(false);

  const fetchCart = useCallback(async () => {
    setIsLoading(true);
    setAlert(null);
    try {
      const response = await api.get(`/admin/users/${userId}/cart`);
      const payload: CartPayload = response.data?.data ?? EMPTY_CART;
      setCart({
        items: payload.items ?? [],
        subtotal: payload.subtotal ?? 0,
        shipping: payload.shipping ?? 0,
        tax: payload.tax ?? 0,
        total: payload.total ?? 0,
      });
    } catch (error) {
      setAlert({ type: "error", message: getErrorMessage(error) });
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchCart();
    }
  }, [fetchCart, userId]);

  const updateQuantity = async (item: CartItem, newQuantity: number) => {
    if (newQuantity < 1) {
      return;
    }

    setUpdatingItemId(item.productId);
    setAlert(null);

    try {
      const response = await api.patch(`/admin/users/${userId}/cart/items`, {
        productId: item.productId,
        selectedDimension: item.selectedDimension,
        selectedCondition: item.selectedCondition,
        selectedDelivery: item.selectedDelivery,
        quantity: newQuantity,
      });

      const payload: CartPayload = response.data?.data ?? cart;
      setCart({
        items: payload.items ?? [],
        subtotal: payload.subtotal ?? 0,
        shipping: payload.shipping ?? 0,
        tax: payload.tax ?? 0,
        total: payload.total ?? 0,
      });
      setAlert({ type: "success", message: "Cart updated." });
    } catch (error) {
      setAlert({ type: "error", message: getErrorMessage(error) });
    } finally {
      setUpdatingItemId(null);
    }
  };

  const removeItem = async (item: CartItem) => {
    setRemovingItemId(item.productId);
    setAlert(null);
    try {
      const response = await api.delete(`/admin/users/${userId}/cart/items`, {
        data: { item },
      });
      const payload: CartPayload = response.data?.data ?? cart;
      setCart({
        items: payload.items ?? [],
        subtotal: payload.subtotal ?? 0,
        shipping: payload.shipping ?? 0,
        tax: payload.tax ?? 0,
        total: payload.total ?? 0,
      });
      setAlert({ type: "success", message: "Item removed from cart." });
    } catch (error) {
      setAlert({ type: "error", message: getErrorMessage(error) });
    } finally {
      setRemovingItemId(null);
    }
  };

  const clearCart = async () => {
    setClearing(true);
    setAlert(null);
    try {
      const response = await api.delete(`/admin/users/${userId}/cart`);
      const payload: CartPayload = response.data?.data ?? EMPTY_CART;
      setCart({
        items: payload.items ?? [],
        subtotal: payload.subtotal ?? 0,
        shipping: payload.shipping ?? 0,
        tax: payload.tax ?? 0,
        total: payload.total ?? 0,
      });
      setAlert({ type: "success", message: "Cart cleared." });
    } catch (error) {
      setAlert({ type: "error", message: getErrorMessage(error) });
    } finally {
      setClearing(false);
    }
  };

  const cartTotals = useMemo(() => [
    { label: "Subtotal", value: cart.subtotal },
    { label: "Shipping", value: cart.shipping },
    { label: "Tax", value: cart.tax },
  ], [cart]);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-900">User Cart</h2>
        {cart.items.length > 0 && (
          <button
            onClick={clearCart}
            className="px-3 py-1 bg-red-100 text-red-800 rounded flex items-center text-sm disabled:opacity-60"
            disabled={clearing}
          >
            {clearing ? "Clearing..." : "Clear Cart"}
          </button>
        )}
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

      {isLoading ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500">Loading cart...</p>
        </div>
      ) : cart.items.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <FiShoppingCart className="mx-auto text-gray-400 text-4xl mb-4" />
          <p className="text-gray-600">The cart is empty</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {cart.items.map((item) => (
                <div
                  key={`${item.productId}-${item.selectedDimension?.dimension ?? ""}-${item.selectedCondition?.condition ?? ""}-${item.selectedDelivery?.method ?? ""}`}
                  className="border-b border-gray-200 last:border-b-0"
                >
                  <div className="p-4 flex">
                    <div className="flex-shrink-0 h-24 w-24 rounded-md overflow-hidden bg-gray-100">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                          No image
                        </div>
                      )}
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between">
                        <h3 className="text-lg font-medium text-gray-900">
                          {item.name}
                        </h3>
                        <button
                          onClick={() => removeItem(item)}
                          className="text-gray-400 hover:text-red-500 disabled:opacity-60"
                          disabled={removingItemId === item.productId}
                        >
                          {removingItemId === item.productId ? "Removing..." : <FiTrash2 />}
                        </button>
                      </div>
                      <p className="text-gray-600 text-sm mt-1">
                        Base price: {formatCurrency(item.basePrice)}
                      </p>
                      {item.selectedDimension?.dimension && (
                        <p className="text-gray-600 text-sm">
                          Dimension: {item.selectedDimension.dimension}
                        </p>
                      )}
                      {item.selectedCondition?.condition && (
                        <p className="text-gray-600 text-sm">
                          Condition: {item.selectedCondition.condition}
                        </p>
                      )}
                      {item.selectedDelivery?.method && (
                        <p className="text-gray-600 text-sm">
                          Delivery: {item.selectedDelivery.method} ({
                            formatCurrency(item.selectedDelivery.price)
                          })
                        </p>
                      )}

                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center border border-gray-300 rounded">
                          <button
                            onClick={() => updateQuantity(item, item.quantity - 1)}
                            className="px-2 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                            disabled={updatingItemId === item.productId}
                          >
                            <FiMinus size={14} />
                          </button>
                          <span className="px-3">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item, item.quantity + 1)}
                            className="px-2 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                            disabled={updatingItemId === item.productId}
                          >
                            <FiPlus size={14} />
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Item price</p>
                          <p className="text-base font-semibold text-gray-900">
                            {formatCurrency(item.itemPrice)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Total</p>
                          <p className="text-base font-semibold text-gray-900">
                            {formatCurrency(item.totalPrice)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="bg-white rounded-lg shadow p-6 space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Order Summary</h3>
              <div className="space-y-2">
                {cartTotals.map((line) => (
                  <div key={line.label} className="flex justify-between text-sm text-gray-600">
                    <span>{line.label}</span>
                    <span>{formatCurrency(line.value)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-200 pt-4 flex justify-between text-base font-semibold text-gray-900">
                <span>Total</span>
                <span>{formatCurrency(cart.total)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserCart;

import { useState, useEffect } from "react";
import {
  FiShoppingCart,
  FiTrash2,
  FiPlus,
  FiMinus,
  FiChevronRight,
  FiArrowLeft,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { toast } from "react-hot-toast";

interface CartItem {
  productId: string;
  name: string;
  basePrice: number;
  quantity: number;
  image: string;
  selectedColor?: string;
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

interface Cart {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

const CartPage = () => {
  const [cart, setCart] = useState<Cart>({
    items: [],
    subtotal: 0,
    shipping: 0,
    tax: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch cart data from backend
  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/auth");
          return;
        }

        const response = await api.get("/user/cart", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Cart response:", response.data);

        if (response.data.status === "success") {
          setCart(response.data.data);
        } else {
          throw new Error(response.data.message || "Failed to fetch cart");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching cart:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [navigate]);

  const updateQuantity = async (index: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/auth");
        return;
      }

      const updatedItem = { ...cart.items[index], quantity: newQuantity };

      const response = await api.put("/user/cart/update", updatedItem, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status === "success") {
        setCart(response.data.data);
      } else {
        throw new Error("Failed to update quantity");
      }
    } catch (err) {
      console.error("Error updating quantity:", err);
      toast.error("Failed to update quantity. Please try again.");
    }
  };

  const removeItem = async (index: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/auth");
        return;
      }

      const productId = cart.items[index].productId;

      const response = await api.delete(`/user/cart/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { itemToRemove: cart.items[index] },
      });
      setCart(response.data.data);
    } catch (err) {
      console.error("Error removing item:", err);
      toast.error("Failed to remove item. Please try again.");
    }
  };

  const handleCardCheckout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/auth");
        return;
      }

      setLoading(true);

      const response = await api.post(
        "/user/checkout/stripe/session",
        { cart },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.message === "address required") {
        navigate("/dashboard/address");
        return;
      }

      if (response.data.status === "success") {
        const { orderId, invoiceId, url, sessionId } = response.data.data;

        localStorage.setItem(
          "currentOrder",
          JSON.stringify({
            orderId,
            invoiceId,
            sessionId,
          })
        );

        window.location.href = url;
      } else {
        throw new Error(response.data.message || "Failed to create checkout");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      toast.error("Failed to proceed to checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleWireCheckout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/auth");
        return;
      }

      setLoading(true);

      const response = await api.post(
        "/user/checkout/wire/request",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.message === "address required") {
        navigate("/dashboard/address");
        return;
      }

      if (response.data.status === "success") {
        toast.success(
          "Your wire transfer request has been received. A secure payment link will be sent to your email shortly."
        );
        navigate("/dashboard/orders");
      } else {
        throw new Error(
          response.data.message || "Failed to request wire transfer"
        );
      }
    } catch (err) {
      console.error("Wire checkout error:", err);
      toast.error(
        "Failed to initiate wire transfer request. Please try again or contact support."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleContinueShopping = () => {
    navigate("/shop");
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center mb-6">
          <FiShoppingCart className="text-gray-600 mr-2" />
          <h1 className="text-2xl font-bold text-gray-800">Your Cart</h1>
        </div>
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center mb-6">
          <FiShoppingCart className="text-gray-600 mr-2" />
          <h1 className="text-2xl font-bold text-gray-800">Your Cart</h1>
        </div>
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="mr-3 text-gray-600 hover:text-gray-800"
        >
          <FiArrowLeft size={20} />
        </button>
        <FiShoppingCart className="text-gray-600 mr-2" />
        <h1 className="text-2xl font-bold text-gray-800">Your Cart</h1>
        <span className="ml-2 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
          {cart.items.length} item{cart.items.length !== 1 ? "s" : ""}
        </span>
      </div>

      {cart.items.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600 mb-4">Your cart is empty</p>
          <button
            onClick={handleContinueShopping}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Browse Containers
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {cart.items.map((item, index) => (
                <div
                  key={`${item.productId}-${index}`}
                  className="border-b border-gray-200 last:border-b-0"
                >
                  <div className="p-4 flex">
                    <div className="flex-shrink-0 h-24 w-24 rounded-md overflow-hidden bg-gray-200">
                      <img
                        src={item.image || "/container-placeholder.jpg"}
                        alt={item.name}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/container-placeholder.jpg";
                        }}
                      />
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between">
                        <h3 className="text-lg font-medium text-gray-900">
                          {item.name}
                        </h3>
                        <button
                          onClick={() => removeItem(index)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                      <p className="text-gray-600 text-sm mt-1">
                        Dimension:{" "}
                        {item.selectedDimension?.dimension || "Standard"}
                      </p>
                      <p className="text-gray-600 text-sm">
                        Condition:{" "}
                        {item.selectedCondition?.condition || "Not specified"}
                      </p>
                      {item.selectedColor && (
                        <p className="text-gray-600 text-sm">
                          Color: {item.selectedColor}
                        </p>
                      )}
                      <p className="text-gray-600 text-sm">
                        Delivery:{" "}
                        {item.selectedDelivery?.method || "Not selected"}
                        {item.selectedDelivery?.price
                          ? ` ($${item.selectedDelivery.price})`
                          : ""}
                      </p>

                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center border border-gray-300 rounded">
                          <button
                            onClick={() =>
                              updateQuantity(index, item.quantity - 1)
                            }
                            className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                            disabled={item.quantity <= 1}
                          >
                            <FiMinus size={14} />
                          </button>
                          <span className="px-3">{item.quantity}</span>
                          <button
                            onClick={() =>
                              updateQuantity(index, item.quantity + 1)
                            }
                            className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                          >
                            <FiPlus size={14} />
                          </button>
                        </div>
                        <p className="text-gray-900 font-medium">
                          ${item.totalPrice.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Order Summary
              </h2>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">
                    ${cart.subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900">
                    ${cart.shipping.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-gray-900">${cart.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-3 mt-3">
                  <span className="text-lg font-medium text-gray-900">
                    Total
                  </span>
                  <span className="text-lg font-medium text-gray-900">
                    ${cart.total.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <button
                  onClick={handleCardCheckout}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 flex items-center justify-center"
                >
                  Pay with Card (Stripe) <FiChevronRight className="ml-2" />
                </button>
                <button
                  onClick={handleWireCheckout}
                  className="w-full bg-white text-blue-600 border border-blue-600 py-3 px-4 rounded-md hover:bg-blue-50 flex items-center justify-center text-sm"
                >
                  Pay via Wire Transfer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;

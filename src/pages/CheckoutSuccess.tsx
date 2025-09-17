// CheckoutSuccess.tsx
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FiCheckCircle, FiXCircle, FiLoader } from "react-icons/fi";
import api from "../services/api";

const CheckoutSuccess = () => {
  const [status, setStatus] = useState<"processing" | "success" | "error">(
    "processing"
  );
  const [error, setError] = useState<string | null>(null);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const confirmPayment = async () => {
      try {
        const token = localStorage.getItem("token");
        const invoiceId = searchParams.get("session_id");
        // const tokenParam = searchParams.get("token"); // PayPal order ID
        const payerId = searchParams.get("PayerID");

        if (!token || !invoiceId) {
          throw new Error("Missing required payment parameters");
        }

        const response = await api.post(
          "/user/checkout/stripe/confirm",
          {
            sessionId: invoiceId,
            payerID: payerId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response)
        if (response.data.status === "success") {
          setStatus("success");
          setOrderDetails(response.data.data);
          // Clear cart and order data
          localStorage.removeItem("currentOrder");
          localStorage.removeItem("cart"); // If you store cart in localStorage
        } else {
          throw new Error(
            response.data.message || "Payment confirmation failed"
          );
        }
      } catch (err) {
        console.error("Payment confirmation error:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Payment failed. Please contact support."
        );
        setStatus("error");
      }
    };

    confirmPayment();
  }, [navigate, searchParams]);

  const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <FiLoader className="animate-spin text-blue-600 text-4xl mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Processing Payment
        </h2>
        <p className="text-gray-600">
          Please wait while we confirm your payment...
        </p>
        <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
          <div className="bg-blue-600 h-2 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );

  const SuccessScreen = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <FiCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Payment Successful!
        </h2>
        <p className="text-gray-600 mb-4">
          Thank you for your purchase. Your order has been confirmed.
        </p>

        {orderDetails && (
          <div className="bg-gray-50 rounded-lg p-4 mb-4 text-left">
            <h3 className="font-semibold text-gray-800 mb-2">Order Details</h3>
            <p className="text-sm text-gray-600">
              <strong>Order ID:</strong> {orderDetails.orderId}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Invoice #:</strong> {orderDetails.invoiceId}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Status:</strong>{" "}
              <span className="text-green-600">Paid</span>
            </p>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <button
            onClick={() => navigate("/dashboard/orders")}
            className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            View My Orders
          </button>
          <button
            onClick={() => navigate("/shop")}
            className="text-blue-600 py-3 px-6 rounded-lg border border-blue-600 hover:bg-blue-50 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );

  const ErrorScreen = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-50">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <FiXCircle className="text-red-500 text-6xl mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Payment Failed
        </h2>
        <p className="text-gray-600 mb-4">{error}</p>

        <div className="flex flex-col gap-2">
          <button
            onClick={() => navigate("/cart")}
            className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Back to Cart
          </button>
          <button
            onClick={() => navigate("/contact")}
            className="text-gray-600 py-3 px-6 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );

  if (status === "processing") return <LoadingSpinner />;
  if (status === "error") return <ErrorScreen />;
  return <SuccessScreen />;
};

export default CheckoutSuccess;

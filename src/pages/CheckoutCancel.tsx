// CheckoutCancel.tsx
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FiXCircle, FiShoppingCart } from "react-icons/fi";
import api from "../services/api";

const CheckoutCancel = () => {
  const [status, setStatus] = useState<"processing" | "cancelled" | "error">("processing");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const cancelPayment = async () => {
      try {
        const token = localStorage.getItem("token");
        const invoiceId = searchParams.get("invoiceId");

        if (!token || !invoiceId) {
          throw new Error("Missing required parameters");
        }

        const response = await api.post(
          "/user/checkout/cancel",
          { invoiceId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.status === "success") {
          setStatus("cancelled");
        } else {
          throw new Error(response.data.message || "Payment cancellation failed");
        }
      } catch (err) {
        console.error("Cancel error:", err);
        setError(err instanceof Error ? err.message : "Cancellation failed");
        setStatus("error");
      }
    };

    cancelPayment();
  }, [navigate, searchParams]);

  const CancelledScreen = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-yellow-50">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <FiXCircle className="text-yellow-500 text-6xl mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Cancelled</h2>
        <p className="text-gray-600 mb-4">
          Your payment was cancelled. No charges have been made to your account.
        </p>
        
        <div className="flex flex-col gap-2">
          <button
            onClick={() => navigate("/dashboard/cart")}
            className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center"
          >
            <FiShoppingCart className="mr-2" />
            Back to Cart
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
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        
        <button
          onClick={() => navigate("/dashboard/cart")}
          className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Back to Cart
        </button>
      </div>
    </div>
  );

  if (status === "processing") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Processing cancellation...</p>
        </div>
      </div>
    );
  }

  if (status === "error") return <ErrorScreen />;
  return <CancelledScreen />;
};

export default CheckoutCancel;
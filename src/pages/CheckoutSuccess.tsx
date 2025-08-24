// CheckoutSuccess.tsx
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../services/api";

const CheckoutSuccess = () => {
  const [status, setStatus] = useState("processing");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const invoiceId = searchParams.get("invoiceId");

  useEffect(() => {
    const confirmPayment = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token || !invoiceId) {
          throw new Error("Missing required parameters");
        }

        const response = await api.post(
          "/checkout/success",
          { invoiceId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.status === "success") {
          setStatus("success");
          // Clear cart and order data
          localStorage.removeItem("currentOrder");
        } else {
          throw new Error(response.data.message || "Payment confirmation failed");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Payment failed");
        setStatus("error");
      }
    };

    confirmPayment();
  }, [invoiceId, navigate]);

  if (status === "processing") {
    return <div>Processing your payment...</div>;
  }

  if (status === "error") {
    return (
      <div>
        <h2>Payment Failed</h2>
        <p>{error}</p>
        <button onClick={() => navigate("/cart")}>Back to Cart</button>
      </div>
    );
  }

  return (
    <div>
      <h2>Payment Successful!</h2>
      <p>Thank you for your purchase. Your order is being processed.</p>
      <button onClick={() => navigate("/orders")}>View Orders</button>
    </div>
  );
};

export default CheckoutSuccess;
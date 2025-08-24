// CheckoutCancel.tsx
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../services/api";

const CheckoutCancel = () => {
  const [status, setStatus] = useState("processing");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const invoiceId = searchParams.get("invoiceId");

  useEffect(() => {
    const cancelPayment = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token || !invoiceId) {
          throw new Error("Missing required parameters");
        }

        const response = await api.post(
          "/checkout/cancel",
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
        setError(err instanceof Error ? err.message : "Cancellation failed");
        setStatus("error");
      }
    };

    cancelPayment();
  }, [invoiceId, navigate]);

  if (status === "processing") {
    return <div>Processing cancellation...</div>;
  }

  if (status === "error") {
    return (
      <div>
        <h2>Cancellation Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate("/cart")}>Back to Cart</button>
      </div>
    );
  }

  return (
    <div>
      <h2>Payment Cancelled</h2>
      <p>Your payment has been cancelled. No charges were made.</p>
      <button onClick={() => navigate("/cart")}>Back to Cart</button>
    </div>
  );
};

export default CheckoutCancel;
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../services/api";
import { Header } from "../components/Header";

interface WireInfo {
  accountName?: string;
  accountNumber?: string;
  routingNumber?: string;
  bankName?: string;
  total: number;
  currency: string;
  expiresAt: string;
  requestId: string;
  invoiceId: string;
  orderId: string;
}

const WirePaymentPage = () => {
  const location = useLocation();
  const [wireInfo, setWireInfo] = useState<WireInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token") ?? "";

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        setLoading(true);
        const response = await api.get("/user/checkout/wire/info", {
          params: { token },
        });

        if (response.data.status === "success") {
          setWireInfo(response.data.data);
        } else {
          setError(response.data.message || "Unable to load payment details.");
        }
      } catch (err) {
        console.error("Error fetching wire info:", err);
        setError("Invalid or expired payment link.");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchInfo();
    } else {
      setError("Missing payment link token.");
      setLoading(false);
    }
  }, [token]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setSuccessMessage(null);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("token", token);
      if (file) {
        formData.append("proof", file);
      }

      const response = await api.post(
        "/user/checkout/wire/proof",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.status === "success") {
        setSuccessMessage(
          "Thank you. Our payment team will verify your transfer within 1–3 business days and process your order."
        );
        setSubmitted(true);
      } else {
        setError(response.data.message || "Failed to submit payment proof.");
      }
    } catch (err) {
      console.error("Error submitting proof:", err);
      setError("Failed to submit payment proof. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileSelect = (selected: File | null) => {
    setFile(selected);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-100">
        <Header />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded shadow">
            Loading payment info…
          </div>
        </div>
      </div>
    );
  }

  if (error || !wireInfo) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-100">
        <Header />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded shadow max-w-md text-center">
            <h1 className="text-xl font-semibold mb-2">Payment link issue</h1>
            <p className="text-gray-700 mb-4">{error}</p>
            <p className="text-gray-600 text-sm">
              If you believe this is a mistake, please contact{" "}
              <a
                href="mailto:admin@deluxconex.com"
                className="text-blue-600 underline"
              >
                admin@deluxconex.com
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-100">
        <Header />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full p-6 rounded-lg shadow text-center">
            <h1 className="text-2xl font-bold mb-3 text-gray-800">
              Payment proof submitted
            </h1>
            <p className="text-gray-700 mb-4">
              Thank you. Our payment team will verify your transfer within{" "}
              <strong>1–3 business days</strong> and process your order.
            </p>
            <p className="text-gray-600 text-sm mb-6">
              If you need any assistance, please contact{" "}
              <a
                href="mailto:admin@deluxconex.com"
                className="text-blue-600 underline"
              >
                admin@deluxconex.com
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white max-w-xl w-full p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">
          Wire Transfer Payment Instructions
        </h1>
        <p className="text-gray-700 mb-4">
          Please use the bank details below to complete your wire transfer. Once
          you have paid, you can optionally upload your proof of payment here.
        </p>

        <div className="bg-gray-50 border rounded p-4 mb-4">
          {wireInfo.bankName && (
            <p className="text-gray-800">
              <strong>Bank:</strong> {wireInfo.bankName}
            </p>
          )}
          {wireInfo.accountName && (
            <p className="text-gray-800">
              <strong>Account Name:</strong> {wireInfo.accountName}
            </p>
          )}
          {wireInfo.accountNumber && (
            <p className="text-gray-800">
              <strong>Account Number:</strong> {wireInfo.accountNumber}
            </p>
          )}
          {wireInfo.routingNumber && (
            <p className="text-gray-800">
              <strong>Routing Number:</strong> {wireInfo.routingNumber}
            </p>
          )}
          <p className="text-gray-800 mt-2">
            <strong>Amount:</strong> {wireInfo.total.toFixed(2)}{" "}
            {wireInfo.currency}
          </p>
          <p className="text-gray-600 text-sm mt-1">
            Link expires on{" "}
            {new Date(wireInfo.expiresAt).toLocaleDateString()}
          </p>
        </div>

        <div className="mb-4 text-gray-700 text-sm">
          <p className="mb-2">
            After making your payment, you can either:
          </p>
          <ul className="list-disc list-inside mb-2 space-y-1">
            <li>Upload your proof of payment (image or PDF) using the form below, or</li>
            <li>
              Email your payment receipt to{" "}
              <a
                href="mailto:admin@deluxconex.com"
                className="text-blue-600 underline"
              >
                admin@deluxconex.com
              </a>
              .
            </li>
          </ul>
          <p>
            You can also reach out to{" "}
            <a
              href="mailto:admin@deluxconex.com"
              className="text-blue-600 underline"
            >
              admin@deluxconex.com
            </a>{" "}
            if you encounter any issues with your transfer.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload proof of payment (optional)
            </label>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`mt-1 flex flex-col items-center justify-center border-2 border-dashed rounded-md px-4 py-6 cursor-pointer text-center ${
                isDragging
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 bg-gray-50 hover:bg-gray-100"
              }`}
            >
              <p className="text-sm text-gray-700 font-medium">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Accepted formats: images (JPG, PNG, etc.) or PDF. Max 20 MB.
              </p>
              {file && (
                <p className="text-xs text-gray-700 mt-2">
                  Selected file: <span className="font-semibold">{file.name}</span>
                </p>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,application/pdf"
              className="hidden"
              onChange={(e) => {
                const selected = e.target.files?.[0] ?? null;
                handleFileSelect(selected);
              }}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-60"
          >
            {submitting
              ? "Submitting..."
              : "Submit (or notify us by email)"}
          </button>
        </form>

        {successMessage && (
          <p className="mt-4 text-green-700 text-sm">{successMessage}</p>
        )}
      </div>
      </div>
    </div>
  );
};

export default WirePaymentPage;

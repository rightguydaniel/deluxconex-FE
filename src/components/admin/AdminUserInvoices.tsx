import { useCallback, useEffect, useState } from "react";
import {
  FiFileText,
  FiDownload,
  FiMail,
  FiCheckCircle,
  FiAlertCircle,
  FiXCircle,
} from "react-icons/fi";
import api from "../../services/api";

enum InvoiceStatus {
  DRAFT = "draft",
  SENT = "sent",
  PAID = "paid",
  OVERDUE = "overdue",
  CANCELLED = "cancelled",
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
  subtotal: number;
  tax: number;
  shipping: number;
  discount?: number;
  total: number;
  notes?: string;
  terms?: string;
}

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

const getStatusIcon = (status: InvoiceStatus) => {
  switch (status) {
    case InvoiceStatus.DRAFT:
      return <FiFileText className="text-gray-500" />;
    case InvoiceStatus.SENT:
      return <FiMail className="text-blue-500" />;
    case InvoiceStatus.PAID:
      return <FiCheckCircle className="text-green-500" />;
    case InvoiceStatus.OVERDUE:
      return <FiAlertCircle className="text-red-500" />;
    case InvoiceStatus.CANCELLED:
    default:
      return <FiXCircle className="text-gray-500" />;
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    amount
  );

const AdminUserInvoices = ({ userId }: { userId: string }) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(
    null
  );
  const [updatingInvoiceId, setUpdatingInvoiceId] = useState<string | null>(null);

  const fetchInvoices = useCallback(async () => {
    setIsLoading(true);
    setAlert(null);
    try {
      const response = await api.get(`/admin/users/${userId}/invoices`);
      setInvoices(response.data?.data ?? []);
    } catch (error) {
      setAlert({ type: "error", message: getErrorMessage(error) });
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchInvoices();
    }
  }, [fetchInvoices, userId]);

  const updateInvoiceStatus = async (invoiceId: string, newStatus: InvoiceStatus) => {
    setUpdatingInvoiceId(invoiceId);
    setAlert(null);
    try {
      await api.patch(`/admin/invoices/${invoiceId}/${newStatus}`);
      setInvoices((prev) =>
        prev.map((invoice) =>
          invoice.id === invoiceId ? { ...invoice, status: newStatus } : invoice
        )
      );
      setAlert({ type: "success", message: "Invoice status updated." });
    } catch (error) {
      setAlert({ type: "error", message: getErrorMessage(error) });
    } finally {
      setUpdatingInvoiceId(null);
    }
  };

  const downloadInvoice = (invoiceId: string) => {
    console.info(`Download invoice ${invoiceId} requested.`);
    setAlert({
      type: "error",
      message: "Invoice download is not yet implemented in this view.",
    });
  };

  const sendInvoice = (invoiceId: string) => {
    console.info(`Send invoice ${invoiceId} requested.`);
    setAlert({
      type: "error",
      message: "Sending invoices from the admin panel is not yet available.",
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-900">User Invoices</h2>
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
        <p className="text-gray-500">Loading invoices...</p>
      ) : invoices.length === 0 ? (
        <p className="text-gray-500">No invoices found for this user.</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Issued
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {invoice.invoiceNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(invoice.issueDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(invoice.dueDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(invoice.total)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      {getStatusIcon(invoice.status)}
                      <select
                        value={invoice.status}
                        onChange={(event) =>
                          updateInvoiceStatus(
                            invoice.id,
                            event.target.value as InvoiceStatus
                          )
                        }
                        className="ml-2 bg-transparent border-none focus:ring-0 focus:border-none capitalize"
                        disabled={updatingInvoiceId === invoice.id}
                      >
                        {Object.values(InvoiceStatus).map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => downloadInvoice(invoice.id)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Download"
                      >
                        <FiDownload />
                      </button>
                      <button
                        onClick={() => sendInvoice(invoice.id)}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Send"
                      >
                        <FiMail />
                      </button>
                      <button
                        onClick={() => window.print()}
                        className="text-gray-600 hover:text-gray-900"
                        title="Print"
                      >
                        <FiFileText />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUserInvoices;

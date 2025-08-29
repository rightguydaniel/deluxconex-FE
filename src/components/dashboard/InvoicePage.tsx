import { useEffect, useState } from "react";
import {
  FiFileText,
  FiDownload,
  FiMail,
  FiCheckCircle,
  FiAlertCircle,
  FiXCircle,
} from "react-icons/fi";
import api from "../../services/api";

const InvoicesPage = () => {
  interface Invoice {
    id: string;
    orderId: string;
    userId: string;
    invoiceNumber: string;
    issueDate: Date;
    dueDate: Date;
    status: string;
    subtotal: number;
    tax: number;
    shipping: number;
    discount?: number;
    total: number;
    notes?: string;
    terms?: string;
  }

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  useEffect(() => {
    // Fetch invoices from API
    const fetchInvoices = async () => {
      // Replace with actual API call
      const response = await api.get("/user/invoices");
      setInvoices(
        response.data.data.map((invoice: any) => ({
          ...invoice,
          issueDate: new Date(invoice.issueDate),
          dueDate: new Date(invoice.dueDate),
        }))
      );
    };
    fetchInvoices();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "draft":
        return <FiFileText className="text-gray-500" />;
      case "sent":
        return <FiMail className="text-blue-500" />;
      case "paid":
        return <FiCheckCircle className="text-green-500" />;
      case "overdue":
        return <FiAlertCircle className="text-red-500" />;
      case "cancelled":
        return <FiXCircle className="text-gray-500" />;
      default:
        return <FiFileText className="text-gray-500" />;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const downloadInvoice = (invoiceId: string) => {
    console.log(`Downloading invoice ${invoiceId}`);
    // Implement actual download logic
  };

  const sendInvoice = (invoiceId: string) => {
    console.log(`Sending invoice ${invoiceId} to customer`);
    // Implement actual send logic
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center mb-6">
        <FiFileText className="text-gray-600 mr-2" />
        <h1 className="text-2xl font-bold text-gray-800">My Invoices</h1>
      </div>

      {invoices.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600 mb-4">You don't have any invoices yet</p>
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Browse Containers
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
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
                    #{invoice.orderId.substring(0, 8)}
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
                      <span className="ml-2 capitalize">{invoice.status}</span>
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

export default InvoicesPage;

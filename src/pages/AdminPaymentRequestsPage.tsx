import { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import api from "../services/api";
import { FiClock, FiCheckCircle, FiEdit2, FiEye } from "react-icons/fi";

interface PaymentRequest {
  id: string;
  userId: string;
  orderId: string;
  invoiceId: string;
  status: string;
  accountName?: string;
  accountNumber?: string;
  routingNumber?: string;
  bankName?: string;
  expiresAt?: string;
  createdAt: string;
  proofUrl?: string;
}

const AdminPaymentRequestsPage = () => {
  const [requests, setRequests] = useState<PaymentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<PaymentRequest | null>(null);
  const [viewing, setViewing] = useState<PaymentRequest | null>(null);
  const [form, setForm] = useState({
    accountName: "",
    accountNumber: "",
    routingNumber: "",
    bankName: "",
    daysValid: 2,
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/payment-requests");
      if (response.data.status === "success") {
        setRequests(response.data.data || []);
      } else {
        setError(response.data.message || "Failed to load payment requests");
      }
    } catch (err) {
      console.error("Error loading payment requests:", err);
      setError("Failed to load payment requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const openIssueModal = (request: PaymentRequest) => {
    setSelected(request);
    setForm({
      accountName: request.accountName || "",
      accountNumber: request.accountNumber || "",
      routingNumber: request.routingNumber || "",
      bankName: request.bankName || "",
      daysValid: 2,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    setSubmitting(true);

    try {
      const response = await api.post(
        `/admin/payment-requests/${selected.id}/issue`,
        form
      );
      if (response.data.status === "success") {
        await fetchRequests();
        setSelected(null);
      } else {
        alert(response.data.message || "Failed to issue wire details.");
      }
    } catch (err) {
      console.error("Issue wire details error:", err);
      alert("Failed to issue wire details. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const isImageProof = (url: string | undefined) => {
    if (!url) return false;
    const lower = url.toLowerCase();
    return (
      lower.endsWith(".jpg") ||
      lower.endsWith(".jpeg") ||
      lower.endsWith(".png") ||
      lower.endsWith(".gif") ||
      lower.endsWith(".webp")
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Wire Payment Requests
          </h1>
        </div>

        {loading ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            Loading payment requests…
          </div>
        ) : error ? (
          <div className="bg-white rounded-lg shadow p-6 text-center text-red-600">
            {error}
          </div>
        ) : requests.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center text-gray-600">
            No wire payment requests found.
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoice
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th> */}
                  {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bank Details
                  </th> */}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {requests.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {r.invoiceId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {r.orderId}
                    </td>
                    {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {r.userId}
                    </td> */}
                    {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {r.bankName || r.accountName
                        ? `${r.bankName ?? ""}${
                            r.bankName && r.accountName ? " · " : ""
                          }${r.accountName ?? ""}`
                        : "Not issued"}
                    </td> */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          r.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : r.status === "issued"
                            ? "bg-blue-100 text-blue-800"
                            : r.status === "proof_submitted"
                            ? "bg-purple-100 text-purple-800"
                            : r.status === "verified"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {r.status === "pending" && <FiClock className="mr-1" />}
                        {r.status === "verified" && (
                          <FiCheckCircle className="mr-1" />
                        )}
                        {r.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(r.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <div className="flex items-center justify-end space-x-3">
                        <button
                          onClick={() => openIssueModal(r)}
                          className="text-blue-600 hover:text-blue-800"
                          title={
                            r.bankName || r.accountName
                              ? "Edit payment details"
                              : "Add payment details"
                          }
                          type="button"
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          onClick={() => setViewing(r)}
                          className="text-gray-600 hover:text-gray-800"
                          title="View request details"
                          type="button"
                        >
                          <FiEye />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selected && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
              <h2 className="text-xl font-semibold mb-4">
                Issue wire transfer details
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Bank name
                  </label>
                  <input
                    type="text"
                    value={form.bankName}
                    onChange={(e) =>
                      setForm({ ...form, bankName: e.target.value })
                    }
                    className="mt-1 w-full border rounded px-3 py-2 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Account name
                  </label>
                  <input
                    type="text"
                    value={form.accountName}
                    onChange={(e) =>
                      setForm({ ...form, accountName: e.target.value })
                    }
                    className="mt-1 w-full border rounded px-3 py-2 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Account number
                  </label>
                  <input
                    type="text"
                    value={form.accountNumber}
                    onChange={(e) =>
                      setForm({ ...form, accountNumber: e.target.value })
                    }
                    className="mt-1 w-full border rounded px-3 py-2 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Routing number
                  </label>
                  <input
                    type="text"
                    value={form.routingNumber}
                    onChange={(e) =>
                      setForm({ ...form, routingNumber: e.target.value })
                    }
                    className="mt-1 w-full border rounded px-3 py-2 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Days before link expires
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={form.daysValid}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        daysValid: Number(e.target.value) || 2,
                      })
                    }
                    className="mt-1 w-full border rounded px-3 py-2 text-sm"
                  />
                </div>
                <div className="flex justify-end space-x-3 mt-4">
                  <button
                    type="button"
                    onClick={() => setSelected(null)}
                    className="px-4 py-2 text-sm rounded border border-gray-300 text-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 text-sm rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    {submitting ? "Sending…" : "Send details"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {viewing && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-xl p-6 overflow-y-auto max-h-[80vh]">
              <h2 className="text-xl font-semibold mb-4">
                Payment request details
              </h2>
              <div className="space-y-2 text-sm text-gray-700 mb-4">
                <p>
                  <span className="font-medium">Invoice ID:</span>{" "}
                  {viewing.invoiceId}
                </p>
                <p>
                  <span className="font-medium">Order ID:</span>{" "}
                  {viewing.orderId}
                </p>
                <p>
                  <span className="font-medium">User ID:</span>{" "}
                  {viewing.userId}
                </p>
                <p>
                  <span className="font-medium">Status:</span>{" "}
                  {viewing.status.replace("_", " ")}
                </p>
                {viewing.bankName && (
                  <p>
                    <span className="font-medium">Bank:</span>{" "}
                    {viewing.bankName}
                  </p>
                )}
                {viewing.accountName && (
                  <p>
                    <span className="font-medium">Account Name:</span>{" "}
                    {viewing.accountName}
                  </p>
                )}
                {viewing.accountNumber && (
                  <p>
                    <span className="font-medium">Account Number:</span>{" "}
                    {viewing.accountNumber}
                  </p>
                )}
                {viewing.routingNumber && (
                  <p>
                    <span className="font-medium">Routing Number:</span>{" "}
                    {viewing.routingNumber}
                  </p>
                )}
                {viewing.expiresAt && (
                  <p>
                    <span className="font-medium">Expires at:</span>{" "}
                    {new Date(viewing.expiresAt).toLocaleString()}
                  </p>
                )}
                <p>
                  <span className="font-medium">Created:</span>{" "}
                  {new Date(viewing.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="mt-4">
                <h3 className="text-md font-semibold mb-2">
                  Proof of payment
                </h3>
                {viewing.proofUrl ? (
                  <div className="space-y-2">
                    <a
                      href={viewing.proofUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline text-sm break-all"
                    >
                      Open proof in new tab
                    </a>
                    {isImageProof(viewing.proofUrl) && (
                      <div className="mt-2">
                        <img
                          src={viewing.proofUrl}
                          alt="Proof of payment"
                          className="max-h-64 w-auto rounded border"
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    No proof of payment has been uploaded yet.
                  </p>
                )}
              </div>

              <div className="flex justify-end mt-6">
                {viewing.status === "proof_submitted" && (
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        const response = await api.post(
                          `/admin/payment-requests/${viewing.id}/approve`
                        );
                        if (response.data.status === "success") {
                          await fetchRequests();
                          setViewing(null);
                          alert(
                            "Wire payment approved and order moved to processing."
                          );
                        } else {
                          alert(
                            response.data.message ||
                              "Failed to approve wire payment."
                          );
                        }
                      } catch (err) {
                        console.error("Approve wire payment error:", err);
                        alert(
                          "Failed to approve wire payment. Please try again."
                        );
                      }
                    }}
                    className="px-4 py-2 mr-3 text-sm rounded bg-green-600 text-white hover:bg-green-700"
                  >
                    Approve payment
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setViewing(null)}
                  className="px-4 py-2 text-sm rounded border border-gray-300 text-gray-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminPaymentRequestsPage;

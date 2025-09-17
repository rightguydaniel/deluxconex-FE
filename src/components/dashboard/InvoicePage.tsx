import { useEffect, useState } from "react";
import {
  FiFileText,
  FiMail,
  FiCheckCircle,
  FiAlertCircle,
  FiXCircle,
  FiEye,
  FiX,
  FiPrinter,
} from "react-icons/fi";
import api from "../../services/api";

interface Invoice {
  id: string;
  orderId: string;
  userId: string;
  invoiceNumber: string;
  issueDate: string | Date;
  dueDate: string | Date;
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
  subtotal: number;
  tax: number;
  shipping: number;
  discount?: number;
  total: number;
  notes?: string;
  terms?: string;
  createdAt?: string;
  updatedAt?: string;
}

const LOGO_URL = "https://deluxconex.com/assets/Deluxconex-CNtfzwkW.png";
const BRAND_BG = "#071623";

const InvoicesPage = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [active, setActive] = useState<Invoice | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchInvoices = async () => {
      const response = await api.get("/user/invoices");
      setInvoices(
        response.data.data.map((inv: any) => ({
          ...inv,
          issueDate: new Date(inv.issueDate),
          dueDate: new Date(inv.dueDate),
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

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const money = (n: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Number(n || 0));

  // const sendInvoice = (invoiceId: string) => {
  //   console.log(`Sending invoice ${invoiceId}`);
  //   // TODO: implement actual send
  // };

  const openDetails = (inv: Invoice) => {
    setActive(inv);
    setOpen(true);
  };
  const closeDetails = () => {
    setOpen(false);
    setActive(null);
  };

  // ---------- Printable HTML (popup, with auto-close after print) ----------
  const buildInvoiceHtml = (inv: Invoice) => {
    return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<title>${inv.invoiceNumber} - Invoice</title>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>
  @media print { @page { margin: 12mm; } .no-print { display:none !important; } }
  body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica Neue, Arial;
         background:#F9FAFB; color:#111827; }
  .card { max-width: 720px; margin: 24px auto; background:#fff; border-radius: 14px; box-shadow: 0 6px 24px rgba(2,6,23,.08); overflow:hidden; }
  .header { display:flex; align-items:center; gap:14px; padding:20px 24px; background:${BRAND_BG}; color:#fff; }
  .logoBox { background:${BRAND_BG}; display:flex; align-items:center; justify-content:center; padding:8px; border-radius:12px; }
  .logoBox img { height:36px; width:auto; display:block; }
  .title { font-size:18px; font-weight:700; letter-spacing:.2px; }
  .muted { color:#E5E7EB; }
  .section { padding:20px 24px; }
  .grid2 { display:grid; grid-template-columns: 1fr 1fr; gap:16px; }
  .kv { display:grid; grid-template-columns: 120px 1fr; gap:8px; font-size:14px; color:#374151; }
  .kv b { color:#111827; }
  .totals td { padding:6px 0; }
  .totals .label { color:#6B7280; }
  .totals .value { text-align:right; color:#111827; }
  .totals .grand { font-weight:700; font-size:16px; }
  .foot { padding:16px 24px; background:#F9FAFB; font-size:12px; color:#6B7280; display:flex; justify-content:space-between; align-items:center; }
  .close-btn { position:fixed; top:12px; right:12px; padding:8px 10px; border:0; border-radius:8px; background:#111827; color:#fff; cursor:pointer; }
  .badge { display:inline-block; padding:6px 10px; border-radius:999px; font-size:12px; background:#F3F4F6; color:#fff; }
  .badge-paid { background:#16a34a; }
  .badge-overdue { background:#dc2626; }
  .badge-sent { background:#2563eb; }
  .badge-draft { background:#6b7280; }
  .badge-cancelled { background:#6b7280; }
</style>
<script>
  function closeMe(){ try { window.close(); } catch(e){} }
  window.onload = () => { setTimeout(() => { window.focus(); window.print(); }, 150); };
  window.onafterprint = closeMe;
  if (window.matchMedia) {
    const mql = window.matchMedia('print');
    if (mql.addEventListener) mql.addEventListener('change', e => { if (!e.matches) closeMe(); });
    else if (mql.addListener) mql.addListener(e => { if (!e.matches) closeMe(); });
  }
  setTimeout(closeMe, 7000);
</script>
</head>
<body>
  <button class="close-btn no-print" onclick="closeMe()">Close</button>
  <div class="card">
    <div class="header">
      <div class="logoBox"><img src="${LOGO_URL}" alt="Deluxconex logo" /></div>
      <div>
        <div class="title">Invoice</div>
        <div class="muted">Invoice No: ${inv.invoiceNumber} • Issued ${new Date(
      inv.issueDate as any
    ).toLocaleDateString()}</div>
      </div>
    </div>

    <div class="section grid2">
      <div>
        <div style="font-weight:600;margin-bottom:6px">Billing</div>
        <div style="color:#6B7280;line-height:1.5">
          Order: #${inv.orderId?.slice(0, 8).toUpperCase()}<br/>
          Status:
          <span class="badge ${
            inv.status === "paid"
              ? "badge-paid"
              : inv.status === "overdue"
              ? "badge-overdue"
              : inv.status === "sent"
              ? "badge-sent"
              : inv.status === "cancelled"
              ? "badge-cancelled"
              : "badge-draft"
          }">${inv.status}</span>
        </div>
      </div>
      <div class="kv">
        <div><b>Issue Date</b></div><div>${new Date(
          inv.issueDate as any
        ).toLocaleDateString()}</div>
        <div><b>Due Date</b></div><div>${new Date(
          inv.dueDate as any
        ).toLocaleDateString()}</div>
        <div><b>Invoice #</b></div><div>${inv.invoiceNumber}</div>
      </div>
    </div>

    <div class="section" style="padding-top:0">
      <table class="totals" style="width:100%; border-collapse:collapse">
        <tbody>
          <tr><td class="label">Subtotal</td><td class="value">${money(
            inv.subtotal
          )}</td></tr>
          <tr><td class="label">Shipping</td><td class="value">${money(
            inv.shipping
          )}</td></tr>
          <tr><td class="label">Tax</td><td class="value">${money(
            inv.tax
          )}</td></tr>
          ${
            inv.discount && Number(inv.discount) > 0
              ? `<tr><td class="label">Discount</td><td class="value">- ${money(
                  inv.discount!
                )}</td></tr>`
              : ""
          }
          <tr><td class="label grand" style="padding-top:10px;">Total</td><td class="value grand" style="padding-top:10px;">${money(
            inv.total
          )}</td></tr>
        </tbody>
      </table>
    </div>

    ${
      inv.notes || inv.terms
        ? `<div class="section grid2" style="padding-top:0">
            <div>
              ${
                inv.notes
                  ? `<div style="font-weight:600;margin-bottom:6px">Notes</div><div style="color:#6B7280">${inv.notes}</div>`
                  : ""
              }
            </div>
            <div>
              ${
                inv.terms
                  ? `<div style="font-weight:600;margin-bottom:6px">Terms</div><div style="color:#6B7280">${inv.terms}</div>`
                  : ""
              }
            </div>
          </div>`
        : ""
    }

    <div class="foot">
      <span>Thank you for your business!</span>
      <span>deluxconex.com</span>
    </div>
  </div>
</body>
</html>`;
  };

  const printInvoice = (inv: Invoice) => {
    const html = buildInvoiceHtml(inv);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const w = window.open(
      url,
      "deluxconex-invoice",
      "width=720,height=900,noopener=yes,resizable=yes,scrollbars=yes"
    );
    if (!w) return;
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  };

  // ---------- UI ----------
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Invoice #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Issued
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Due
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {inv.invoiceNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    #{inv.orderId?.substring(0, 8).toUpperCase()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(inv.issueDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(inv.dueDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {money(inv.total)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      {getStatusIcon(inv.status)}
                      <span className="ml-2 capitalize">{inv.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-3">
                      <button
                        className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
                        onClick={() => openDetails(inv)}
                        title="View"
                      >
                        <FiEye /> View
                      </button>
                      <button
                        onClick={() => printInvoice(inv)}
                        className="text-gray-700 hover:text-black inline-flex items-center gap-1"
                        title="Print"
                      >
                        <FiPrinter /> Print
                      </button>
                      {/* <button
                        onClick={() => downloadInvoice(inv.id)}
                        className="text-indigo-600 hover:text-indigo-900 inline-flex items-center gap-1"
                        title="Download"
                      >
                        <FiDownload /> PDF
                      </button>
                      <button
                        onClick={() => sendInvoice(inv.id)}
                        className="text-sky-600 hover:text-sky-800 inline-flex items-center gap-1"
                        title="Send"
                      >
                        <FiMail /> Send
                      </button> */}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Details Modal */}
      {open && active && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={closeDetails}
          />
          <div className="absolute inset-x-0 bottom-0 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 w-full sm:w-[680px] bg-white rounded-t-2xl sm:rounded-2xl shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-3">
                <div
                  className="h-8 w-8 rounded-lg flex items-center justify-center"
                  style={{ background: BRAND_BG }}
                >
                  <img src={LOGO_URL} alt="logo" className="h-5 w-auto" />
                </div>
                <div>
                  <div className="text-base font-semibold">
                    Invoice {active.invoiceNumber}
                  </div>
                  <div className="text-xs text-gray-500">
                    Issued {formatDate(active.issueDate)} • Due{" "}
                    {formatDate(active.dueDate)}
                  </div>
                </div>
              </div>
              <button
                onClick={closeDetails}
                className="p-2 rounded-md hover:bg-gray-100"
              >
                <FiX />
              </button>
            </div>

            <div className="p-4 space-y-4 max-h-[70vh] overflow-auto">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-1">Summary</div>
                  <div className="text-sm text-gray-800">
                    Order: #{active.orderId?.substring(0, 8).toUpperCase()}
                    <br />
                    Status: <span className="capitalize">{active.status}</span>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-1">Dates</div>
                  <div className="text-sm text-gray-800">
                    Issued: {formatDate(active.issueDate)}
                    <br />
                    Due: {formatDate(active.dueDate)}
                  </div>
                </div>
              </div>

              <div className="border-t pt-3">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>{money(active.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span>{money(active.shipping)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Tax</span>
                  <span>{money(active.tax)}</span>
                </div>
                {active.discount ? (
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Discount</span>
                    <span>- {money(active.discount)}</span>
                  </div>
                ) : null}
                <div className="flex justify-between text-base font-semibold mt-2">
                  <span>Total</span>
                  <span>{money(active.total)}</span>
                </div>
              </div>
            </div>

            <div className="p-4 border-t flex justify-end gap-3">
              <button
                onClick={() => printInvoice(active)}
                className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-md"
                style={{ background: BRAND_BG, color: "#fff" }}
              >
                <FiPrinter /> Print Invoice
              </button>
              <button
                onClick={closeDetails}
                className="text-sm px-3 py-2 rounded-md border hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoicesPage;

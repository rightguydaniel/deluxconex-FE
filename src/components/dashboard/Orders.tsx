import { useEffect, useState } from "react";
import {
  FiPackage,
  FiChevronRight,
  FiClock,
  FiCheckCircle,
  FiTruck,
  FiXCircle,
  FiPrinter,
  FiX,
} from "react-icons/fi";
import api from "../../services/api";

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  dimension?: string;
  deliveryMethod: string;
  deliveryPrice: number;
  image: string;
}
interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}
interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status:
    | "pending"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "confirmed";
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  trackingNumber?: string | null;
  createdAt: string;
  updatedAt?: string;
}

const LOGO_URL = "https://deluxconex.com/assets/Deluxconex-CNtfzwkW.png";
const BRAND_BG = "#071623";

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get("/user/orders");
        setOrders(response.data.data);
      } catch (err: any) {
        console.error("Failed to fetch orders:", err.message);
      }
    };
    fetchOrders();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <FiClock className="text-yellow-500" />;
      case "processing":
        return <FiPackage className="text-blue-500" />;
      case "shipped":
        return <FiTruck className="text-indigo-500" />;
      case "delivered":
      case "confirmed":
        return <FiCheckCircle className="text-green-500" />;
      case "cancelled":
        return <FiXCircle className="text-red-500" />;
      default:
        return <FiClock className="text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const openDetails = (order: Order) => {
    setActiveOrder(order);
    setDetailsOpen(true);
  };

  const closeDetails = () => {
    setDetailsOpen(false);
    setActiveOrder(null);
  };

  const currency = (n: number) => `$${Number(n).toFixed(2)}`;
  const buildReceiptHtmlB = (order: Order) => {
    const currency = (n: number) => `$${Number(n).toFixed(2)}`;
    const itemsRows = order.items
      .map(
        (it) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px dashed #E5E7EB;">
          <div style="display:flex;gap:12px;align-items:center">
            <img src="${it.image}" alt="${
          it.name
        }" style="width:56px;height:56px;object-fit:cover;border-radius:8px;border:1px solid #e5e7eb"/>
            <div>
              <div style="font-weight:600;color:#111827;font-size:14px;line-height:1.2">${
                it.name
              }</div>
              <div style="color:#6B7280;font-size:12px;margin-top:2px">
                ${it.dimension ? `${it.dimension} • ` : ""}${
          it.deliveryMethod
        } (${currency(it.deliveryPrice)})
              </div>
            </div>
          </div>
        </td>
        <td style="padding:10px 0;border-bottom:1px dashed #E5E7EB;text-align:center;color:#111827;">${
          it.quantity
        }</td>
        <td style="padding:10px 0;border-bottom:1px dashed #E5E7EB;text-align:right;color:#111827;">${currency(
          it.price
        )}</td>
      </tr>`
      )
      .join("");

    return `<!DOCTYPE html>
  <html>
  <head>
  <meta charset="utf-8" />
  <title>Receipt - ${order.id.slice(0, 8).toUpperCase()}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    @media print { @page { margin: 12mm; } .no-print { display:none !important; } }
    body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica Neue, Arial; background:#F9FAFB; color:#111827; }
    .card { max-width: 720px; margin: 24px auto; background:#fff; border-radius: 14px; box-shadow: 0 6px 24px rgba(2,6,23,.08); overflow:hidden; }
    .header { display:flex; align-items:center; gap:14px; padding:20px 24px; background:#071623; color:#fff; }
    .logoBox { background:#071623; display:flex; align-items:center; justify-content:center; padding:8px; border-radius:12px; }
    .logoBox img { height:36px; width:auto; display:block; }
    .title { font-size:18px; font-weight:700; letter-spacing:.2px; }
    .muted { color:#6B7280; }
    .grid { display:grid; grid-template-columns: 1fr 1fr; gap:16px; }
    .section { padding:20px 24px; }
    .totals td { padding:6px 0; }
    .totals .label { color:#6B7280; }
    .totals .value { text-align:right; color:#111827; }
    .totals .grand { font-weight:700; font-size:16px; }
    .foot { padding:16px 24px; background:#F9FAFB; font-size:12px; color:#6B7280; display:flex; justify-content:space-between; align-items:center; }
    table { width:100%; border-collapse:collapse; }
    .close-btn { position:fixed; top:12px; right:12px; padding:8px 10px; border:0; border-radius:8px; background:#111827; color:#fff; cursor:pointer; }
  </style>
  <script>
    function closeMe(){ try { window.close(); } catch(e){} }
    window.onload = () => {
      setTimeout(() => { window.focus(); window.print(); }, 150);
    };
    window.onafterprint = closeMe;
    // Safari/Firefox fallback: close when leaving print preview
    if (window.matchMedia) {
      const mql = window.matchMedia('print');
      if (mql.addEventListener) {
        mql.addEventListener('change', e => { if (!e.matches) closeMe(); });
      } else if (mql.addListener) {
        mql.addListener(e => { if (!e.matches) closeMe(); });
      }
    }
    // Hard fallback in case neither fires
    setTimeout(closeMe, 7000);
  </script>
  </head>
  <body>
    <button class="close-btn no-print" onclick="closeMe()">Close</button>
    <div class="card">
      <div class="header">
        <div class="logoBox"><img src="https://deluxconex.com/assets/Deluxconex-CNtfzwkW.png" alt="Deluxconex logo" /></div>
        <div>
          <div class="title">Payment Receipt</div>
          <div class="muted">Order #${order.id
            .slice(0, 8)
            .toUpperCase()} • ${new Date(
      order.createdAt
    ).toLocaleString()}</div>
        </div>
      </div>
      <div class="section grid">
        <div>
          <div style="font-weight:600;margin-bottom:6px">Billed To</div>
          <div class="muted" style="line-height:1.4">
            ${order.shippingAddress.street}<br/>
            ${order.shippingAddress.city}, ${order.shippingAddress.state} ${
      order.shippingAddress.postalCode
    }<br/>
            ${order.shippingAddress.country}
          </div>
        </div>
        <div>
          <div style="font-weight:600;margin-bottom:6px">Order Info</div>
          <div class="muted" style="line-height:1.6">
            Status: ${order.status}<br/>
            Payment: ${order.paymentMethod} • ${order.paymentStatus}<br/>
            ${order.trackingNumber ? `Tracking: ${order.trackingNumber}` : ""}
          </div>
        </div>
      </div>
      <div class="section">
        <div style="font-weight:600;margin-bottom:10px">Items</div>
        <table>
          <thead>
            <tr>
              <th style="text-align:left;color:#6B7280;font-weight:600;padding-bottom:8px;border-bottom:1px solid #E5E7EB;">Product</th>
              <th style="text-align:center;color:#6B7280;font-weight:600;padding-bottom:8px;border-bottom:1px solid #E5E7EB;">Qty</th>
              <th style="text-align:right;color:#6B7280;font-weight:600;padding-bottom:8px;border-bottom:1px solid #E5E7EB;">Price</th>
            </tr>
          </thead>
          <tbody>${itemsRows}</tbody>
        </table>
      </div>
      <div class="section" style="padding-top:0">
        <table class="totals"><tbody>
          <tr><td class="label">Subtotal</td><td class="value">${currency(
            order.subtotal
          )}</td></tr>
          <tr><td class="label">Shipping</td><td class="value">${currency(
            order.shipping
          )}</td></tr>
          <tr><td class="label">Tax</td><td class="value">${currency(
            order.tax
          )}</td></tr>
          <tr><td class="label grand" style="padding-top:10px;">Total</td><td class="value grand" style="padding-top:10px;">${currency(
            order.total
          )}</td></tr>
        </tbody></table>
      </div>
      <div class="foot">
        <span>Thank you for shopping with Deluxconex.</span>
        <span>deluxconex.com</span>
      </div>
    </div>
  </body>
  </html>`;
  };

  const handlePrint = (order: Order) => {
    const html = buildReceiptHtmlB(order);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const w = window.open(
      url,
      "deluxconex-receipt",
      "width=720,height=900,noopener=yes,resizable=yes,scrollbars=yes"
    );
    if (!w) {
      return;
    }
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center mb-6">
        <FiPackage className="text-gray-600 mr-2" />
        <h1 className="text-2xl font-bold text-gray-800">My Orders</h1>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600 mb-4">
            You haven't placed any orders yet
          </p>
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Browse Containers
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-lg shadow overflow-hidden"
            >
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <div className="flex items-center">
                  {getStatusIcon(order.status)}
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      Order #{order.id.substring(0, 8).toUpperCase()}
                    </p>
                    <p className="text-sm text-gray-500">
                      Placed on {formatDate(order.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {currency(order.total)}
                  </p>
                  <p className="text-sm text-gray-500 capitalize">
                    {order.status}
                  </p>
                </div>
              </div>

              <div className="p-4">
                {Array.isArray(order.items) &&
                  order.items.map((item, index) => (
                    <div key={index} className="flex mb-4 last:mb-0">
                      <div className="flex-shrink-0 h-16 w-16 rounded-md overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="ml-4 flex-1">
                        <h3 className="text-sm font-medium text-gray-900">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {item.dimension} • {currency(item.price)} ×{" "}
                          {item.quantity}
                        </p>
                        <p className="text-sm text-gray-500">
                          Delivery: {item.deliveryMethod} (
                          {currency(item.deliveryPrice)})
                        </p>
                      </div>
                    </div>
                  ))}
              </div>

              <div className="p-4 bg-gray-50 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <div>
                  <p className="text-sm text-gray-600">Shipping to:</p>
                  <p className="text-sm font-medium text-gray-900">
                    {order.shippingAddress.street}, {order.shippingAddress.city}
                    , {order.shippingAddress.state}{" "}
                    {order.shippingAddress.postalCode},{" "}
                    {order.shippingAddress.country}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => openDetails(order)}
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    View Details <FiChevronRight className="ml-1" />
                  </button>
                  <button
                    onClick={() => handlePrint(order)}
                    className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-md border border-gray-300 hover:bg-gray-100 text-gray-700"
                    title="Print receipt"
                  >
                    <FiPrinter /> Print
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Details Modal */}
      {detailsOpen && activeOrder && (
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
                    Order #{activeOrder.id.substring(0, 8).toUpperCase()}
                  </div>
                  <div className="text-xs text-gray-500">
                    Placed on {formatDate(activeOrder.createdAt)}
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
                  <div className="text-xs text-gray-500 mb-1">
                    Shipping Address
                  </div>
                  <div className="text-sm text-gray-800">
                    {activeOrder.shippingAddress.street}
                    <br />
                    {activeOrder.shippingAddress.city},{" "}
                    {activeOrder.shippingAddress.state}{" "}
                    {activeOrder.shippingAddress.postalCode}
                    <br />
                    {activeOrder.shippingAddress.country}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-1">Payment</div>
                  <div className="text-sm text-gray-800">
                    Method: {activeOrder.paymentMethod}
                    <br />
                    Status:{" "}
                    <span className="capitalize">
                      {activeOrder.paymentStatus}
                    </span>
                    <br />
                    Order Status:{" "}
                    <span className="capitalize">{activeOrder.status}</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-sm font-semibold mb-2">Items</div>
                <div className="space-y-3">
                  {activeOrder.items.map((it, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <img
                        src={it.image}
                        alt={it.name}
                        className="w-14 h-14 object-cover rounded-md border"
                      />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">
                          {it.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {it.dimension ? `${it.dimension} • ` : ""}
                          {it.deliveryMethod} ({currency(it.deliveryPrice)})
                        </div>
                      </div>
                      <div className="text-right text-sm text-gray-700">
                        {it.quantity} × {currency(it.price)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-3">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>{currency(activeOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span>{currency(activeOrder.shipping)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Tax</span>
                  <span>{currency(activeOrder.tax)}</span>
                </div>
                <div className="flex justify-between text-base font-semibold mt-2">
                  <span>Total</span>
                  <span>{currency(activeOrder.total)}</span>
                </div>
              </div>
            </div>

            <div className="p-4 border-t flex justify-end gap-3">
              <button
                onClick={() => handlePrint(activeOrder)}
                className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-md"
                style={{ background: BRAND_BG, color: "#fff" }}
              >
                <FiPrinter /> Print Receipt
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

export default Orders;

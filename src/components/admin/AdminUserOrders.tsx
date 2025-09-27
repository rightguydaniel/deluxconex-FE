import { useEffect, useMemo, useState } from 'react';
import { FiPackage, FiClock, FiCheckCircle, FiTruck, FiXCircle } from 'react-icons/fi';
import api from '../../services/api';

type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

interface OrderItem {
  productId?: string;
  name: string;
  price?: number;
  quantity: number;
  image?: string;
  itemPrice?: number;
  totalPrice?: number;
  selectedDimension?: { dimension: string; priceAdjustment?: number };
  selectedCondition?: { condition: string; priceAdjustment?: number };
  selectedDelivery?: { method: string; price: number };
}

interface ShippingAddress {
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

interface Order {
  id: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal?: number;
  shipping?: number;
  tax?: number;
  total: number;
  createdAt: string;
  shippingAddress?: ShippingAddress | null;
}

const getStatusIcon = (status: OrderStatus) => {
  switch (status) {
    case 'pending':
      return <FiClock className="text-yellow-500" />;
    case 'processing':
      return <FiPackage className="text-blue-500" />;
    case 'shipped':
      return <FiTruck className="text-indigo-500" />;
    case 'delivered':
      return <FiCheckCircle className="text-green-500" />;
    case 'cancelled':
      return <FiXCircle className="text-red-500" />;
    default:
      return <FiClock className="text-gray-500" />;
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);

const parseShippingAddress = (address: unknown): ShippingAddress | null => {
  if (!address) {
    return null;
  }

  if (typeof address === 'string') {
    try {
      const parsed = JSON.parse(address);
      return typeof parsed === 'object' && parsed !== null ? (parsed as ShippingAddress) : null;
    } catch (error) {
      console.warn('Unable to parse shipping address string', error);
      return null;
    }
  }

  if (typeof address === 'object') {
    return address as ShippingAddress;
  }

  return null;
};

const getOrderTotalDisplay = (order: Order) => {
  const subtotal = order.subtotal ?? 0;
  const shipping = order.shipping ?? 0;
  const tax = order.tax ?? 0;
  const total = order.total ?? subtotal + shipping + tax;
  return total;
};

const AdminUserOrders = ({ userId }: { userId: string }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionAlert, setActionAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchOrders = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get(`/admin/users/${userId}/orders`);
        if (!isMounted) {
          return;
        }

        const fetchedOrders: Order[] = (response.data?.data ?? []).map((order: any) => ({
          id: order.id,
          status: order.status as OrderStatus,
          items: Array.isArray(order.items) ? order.items : [],
          subtotal: order.subtotal,
          shipping: order.shipping,
          tax: order.tax,
          total: order.total,
          createdAt: order.createdAt,
          shippingAddress: parseShippingAddress(order.shippingAddress),
        }));

        setOrders(fetchedOrders);
      } catch (err) {
        if (isMounted) {
          const message = err instanceof Error ? err.message : 'Failed to load orders.';
          setError(message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    if (userId) {
      fetchOrders();
    }

    return () => {
      isMounted = false;
    };
  }, [userId]);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingOrderId(orderId);
    setActionAlert(null);
    try {
      await api.patch(`/admin/order/${orderId}`, { status: newStatus });
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status: newStatus,
              }
            : order
        )
      );
      setActionAlert({ type: 'success', message: 'Order status updated successfully.' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to update order status.';
      setActionAlert({ type: 'error', message });
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const statusClassName = useMemo(() => {
    return (status: OrderStatus) => {
      switch (status) {
        case 'pending':
          return 'text-yellow-600';
        case 'processing':
          return 'text-blue-600';
        case 'shipped':
          return 'text-indigo-600';
        case 'delivered':
          return 'text-green-600';
        case 'cancelled':
        default:
          return 'text-red-600';
      }
    };
  }, []);

  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-4">User Orders</h2>

      {actionAlert && (
        <div
          className={`mb-4 rounded-md px-4 py-2 text-sm ${
            actionAlert.type === 'success'
              ? 'bg-green-50 text-green-700'
              : 'bg-red-50 text-red-700'
          }`}
        >
          {actionAlert.message}
        </div>
      )}

      {isLoading ? (
        <p className="text-gray-500">Loading orders...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-500">No orders found for this user.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const shippingAddress = order.shippingAddress;
            const orderTotal = getOrderTotalDisplay(order);

            return (
              <div key={order.id} className="bg-white rounded-lg shadow overflow-hidden">
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
                      {formatCurrency(orderTotal)}
                    </p>
                    <select
                      value={order.status}
                      onChange={(event) =>
                        handleStatusChange(order.id, event.target.value as OrderStatus)
                      }
                      className={`text-sm capitalize bg-transparent border-none focus:ring-0 focus:border-none ${statusClassName(order.status)}`}
                      disabled={updatingOrderId === order.id}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div className="p-4">
                  {order.items.map((item, index) => {
                    const itemPrice = item.price ?? item.itemPrice ?? 0;
                    const totalPrice = item.totalPrice ?? itemPrice * item.quantity;
                    return (
                      <div key={`${item.productId ?? index}-${index}`} className="flex mb-4 last:mb-0">
                        <div className="flex-shrink-0 h-16 w-16 rounded-md overflow-hidden bg-gray-100">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                              No image
                            </div>
                          )}
                        </div>
                        <div className="ml-4 flex-1">
                          <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                          <p className="text-sm text-gray-500">
                            {formatCurrency(itemPrice)} × {item.quantity}
                            {item.selectedCondition?.condition && (
                              <span className="ml-2 text-gray-400">
                                ({item.selectedCondition.condition})
                              </span>
                            )}
                          </p>
                          {item.selectedDelivery?.method && (
                            <p className="text-xs text-gray-500">
                              Delivery: {item.selectedDelivery.method}{' '}
                              {item.selectedDelivery.price
                                ? `(${formatCurrency(item.selectedDelivery.price)})`
                                : null}
                            </p>
                          )}
                          <p className="text-xs text-gray-400">Item total: {formatCurrency(totalPrice)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="p-4 bg-gray-50">
                  <p className="text-sm text-gray-600">Shipping to:</p>
                  {shippingAddress ? (
                    <p className="text-sm font-medium text-gray-900">
                      {[shippingAddress.street, shippingAddress.city, shippingAddress.state]
                        .filter(Boolean)
                        .join(', ')}{' '}
                      {shippingAddress.postalCode}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-500">No shipping address on file.</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminUserOrders;

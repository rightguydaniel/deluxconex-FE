import { useState } from 'react';
import { FiPackage, FiClock, FiCheckCircle, FiTruck, FiXCircle } from 'react-icons/fi';

interface Order {
  id: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: Array<{
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  total: number;
  createdAt: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

const AdminUserOrders = ({ userId }: { userId: string }) => {
  console.log(userId)

  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ord-001',
      status: 'processing',
      items: [
        {
          name: '20ft Shipping Container',
          price: 2500,
          quantity: 1,
          image: '/container-20ft.jpg'
        }
      ],
      total: 2750,
      createdAt: '2023-05-15T10:30:00Z',
      shippingAddress: {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        country: 'USA'
      }
    },
    {
      id: 'ord-002',
      status: 'delivered',
      items: [
        {
          name: '40ft Shipping Container',
          price: 3800,
          quantity: 1,
          image: '/container-40ft.jpg'
        }
      ],
      total: 4180,
      createdAt: '2023-04-20T14:15:00Z',
      shippingAddress: {
        street: '456 Oak Ave',
        city: 'Los Angeles',
        state: 'CA',
        postalCode: '90001',
        country: 'USA'
      }
    }
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <FiClock className="text-yellow-500" />;
      case 'processing': return <FiPackage className="text-blue-500" />;
      case 'shipped': return <FiTruck className="text-indigo-500" />;
      case 'delivered': return <FiCheckCircle className="text-green-500" />;
      case 'cancelled': return <FiXCircle className="text-red-500" />;
      default: return <FiClock className="text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-4">User Orders</h2>
      
      {orders.length === 0 ? (
        <p className="text-gray-500">No orders found for this user.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
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
                    ${order.total.toFixed(2)}
                  </p>
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                    className={`text-sm capitalize ${
                      order.status === 'pending' ? 'text-yellow-600' :
                      order.status === 'processing' ? 'text-blue-600' :
                      order.status === 'shipped' ? 'text-indigo-600' :
                      order.status === 'delivered' ? 'text-green-600' : 'text-red-600'
                    } bg-transparent border-none focus:ring-0 focus:border-none`}
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
                {order.items.map((item, index) => (
                  <div key={index} className="flex mb-4 last:mb-0">
                    <div className="flex-shrink-0 h-16 w-16 rounded-md overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-500">
                        ${item.price.toFixed(2)} × {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-gray-50">
                <p className="text-sm text-gray-600">Shipping to:</p>
                <p className="text-sm font-medium text-gray-900">
                  {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminUserOrders;
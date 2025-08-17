import { useState } from "react";
import {
  FiPackage,
  FiChevronRight,
  FiClock,
  FiCheckCircle,
  FiTruck,
  FiXCircle,
} from "react-icons/fi";

const Orders = () => {
  const [orders, setOrders] = useState([
    {
      id: "ord-001",
      items: [
        {
          productId: "cont-20ft",
          name: "20ft Shipping Container",
          price: 2800,
          quantity: 1,
          image: "/container-20ft.jpg",
          dimension: "20ft",
          deliveryMethod: "Local Delivery",
          deliveryPrice: 250,
        },
      ],
      subtotal: 2800,
      shipping: 250,
      tax: 305,
      total: 3355,
      status: "processing",
      shippingAddress: {
        street: "123 Main St",
        city: "New York",
        state: "NY",
        postalCode: "10001",
        country: "USA",
      },
      paymentMethod: "Credit Card",
      paymentStatus: "paid",
      trackingNumber: "TRK123456789",
      createdAt: "2023-05-15T10:30:00Z",
    },
    {
      id: "ord-002",
      items: [
        {
          productId: "cont-40ft",
          name: "40ft Shipping Container",
          price: 3800,
          quantity: 1,
          image: "/container-40ft.jpg",
          dimension: "40ft",
          deliveryMethod: "Pickup",
          deliveryPrice: 0,
        },
      ],
      subtotal: 3800,
      shipping: 0,
      tax: 380,
      total: 4180,
      status: "delivered",
      shippingAddress: {
        street: "456 Oak Ave",
        city: "Los Angeles",
        state: "CA",
        postalCode: "90001",
        country: "USA",
      },
      paymentMethod: "PayPal",
      paymentStatus: "paid",
      trackingNumber: "TRK987654321",
      createdAt: "2023-04-20T14:15:00Z",
    },
  ]);
  setOrders(orders)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <FiClock className="text-yellow-500" />;
      case "processing":
        return <FiPackage className="text-blue-500" />;
      case "shipped":
        return <FiTruck className="text-indigo-500" />;
      case "delivered":
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
    });
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
                    ${order.total.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500 capitalize">
                    {order.status}
                  </p>
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
                      <h3 className="text-sm font-medium text-gray-900">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {item.dimension} • ${item.price.toFixed(2)} ×{" "}
                        {item.quantity}
                      </p>
                      <p className="text-sm text-gray-500">
                        Delivery: {item.deliveryMethod} ($
                        {item.deliveryPrice.toFixed(2)})
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-gray-50 flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Shipping to:</p>
                  <p className="text-sm font-medium text-gray-900">
                    {order.shippingAddress.street}, {order.shippingAddress.city}
                    , {order.shippingAddress.state}{" "}
                    {order.shippingAddress.postalCode}
                  </p>
                </div>
                <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                  View Details <FiChevronRight className="ml-1" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;

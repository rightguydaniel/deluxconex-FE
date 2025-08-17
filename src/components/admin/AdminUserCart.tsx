import { useState } from "react";
import { FiShoppingCart, FiTrash2, FiPlus, FiMinus } from "react-icons/fi";

// interface CartItem {
//   productId: string;
//   name: string;
//   basePrice: number;
//   quantity: number;
//   image: string;
//   selectedDimension?: {
//     dimension: string;
//     priceAdjustment?: number;
//   };
//   selectedCondition?: {
//     condition: string;
//     priceAdjustment?: number;
//   };
//   selectedDelivery?: {
//     method: string;
//     price: number;
//   };
//   itemPrice: number;
//   totalPrice: number;
// }

const AdminUserCart = ({ userId }: { userId: string }) => {
  console.log(userId);

  const [cart, setCart] = useState({
    items: [
      {
        productId: "cont-20ft",
        name: "20ft Shipping Container",
        basePrice: 2500,
        quantity: 1,
        image: "/container-20ft.jpg",
        selectedDimension: {
          dimension: "20ft",
          priceAdjustment: 0,
        },
        selectedCondition: {
          condition: "New",
          priceAdjustment: 300,
        },
        selectedDelivery: {
          method: "Local Delivery",
          price: 250,
        },
        itemPrice: 2800,
        totalPrice: 2800,
      },
      {
        productId: "cont-40ft",
        name: "40ft Shipping Container",
        basePrice: 3800,
        quantity: 1,
        image: "/container-40ft.jpg",
        selectedDimension: {
          dimension: "40ft",
          priceAdjustment: 0,
        },
        selectedCondition: {
          condition: "Used",
          priceAdjustment: -500,
        },
        selectedDelivery: {
          method: "Pickup",
          price: 0,
        },
        itemPrice: 3300,
        totalPrice: 3300,
      },
    ],
    subtotal: 6100,
    shipping: 250,
    tax: 635,
    total: 6985,
  });

  const updateQuantity = (index: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    const newCart = { ...cart };
    newCart.items[index].quantity = newQuantity;
    newCart.items[index].totalPrice =
      newCart.items[index].itemPrice * newQuantity;

    // Recalculate totals
    newCart.subtotal = newCart.items.reduce(
      (sum, item) => sum + item.totalPrice,
      0
    );
    newCart.tax = newCart.subtotal * 0.1; // Example 10% tax
    newCart.total = newCart.subtotal + newCart.shipping + newCart.tax;

    setCart(newCart);
  };

  const removeItem = (index: number) => {
    const newCart = { ...cart };
    newCart.items.splice(index, 1);

    // Recalculate totals
    newCart.subtotal = newCart.items.reduce(
      (sum, item) => sum + item.totalPrice,
      0
    );
    newCart.tax = newCart.subtotal * 0.1;
    newCart.total = newCart.subtotal + newCart.shipping + newCart.tax;

    setCart(newCart);
  };

  const clearCart = () => {
    setCart({
      items: [],
      subtotal: 0,
      shipping: 0,
      tax: 0,
      total: 0,
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-900">User Cart</h2>
        {cart.items.length > 0 && (
          <button
            onClick={clearCart}
            className="px-3 py-1 bg-red-100 text-red-800 rounded flex items-center text-sm"
          >
            Clear Cart
          </button>
        )}
      </div>

      {cart.items.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <FiShoppingCart className="mx-auto text-gray-400 text-4xl mb-4" />
          <p className="text-gray-600">The cart is empty</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {cart.items.map((item, index) => (
                <div
                  key={index}
                  className="border-b border-gray-200 last:border-b-0"
                >
                  <div className="p-4 flex">
                    <div className="flex-shrink-0 h-24 w-24 rounded-md overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between">
                        <h3 className="text-lg font-medium text-gray-900">
                          {item.name}
                        </h3>
                        <button
                          onClick={() => removeItem(index)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                      <p className="text-gray-600 text-sm mt-1">
                        Dimension: {item.selectedDimension?.dimension}
                      </p>
                      <p className="text-gray-600 text-sm">
                        Condition: {item.selectedCondition?.condition}
                      </p>
                      <p className="text-gray-600 text-sm">
                        Delivery: {item.selectedDelivery?.method} ($
                        {item.selectedDelivery?.price})
                      </p>

                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center border border-gray-300 rounded">
                          <button
                            onClick={() =>
                              updateQuantity(index, item.quantity - 1)
                            }
                            className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                          >
                            <FiMinus size={14} />
                          </button>
                          <span className="px-3">{item.quantity}</span>
                          <button
                            onClick={() =>
                              updateQuantity(index, item.quantity + 1)
                            }
                            className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                          >
                            <FiPlus size={14} />
                          </button>
                        </div>
                        <p className="text-gray-900 font-medium">
                          ${item.totalPrice.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Cart Summary
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">
                    ${cart.subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900">
                    ${cart.shipping.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-gray-900">${cart.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-3 mt-3">
                  <span className="text-lg font-medium text-gray-900">
                    Total
                  </span>
                  <span className="text-lg font-medium text-gray-900">
                    ${cart.total.toFixed(2)}
                  </span>
                </div>
              </div>

              <button className="mt-6 w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700">
                Checkout on User's Behalf
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserCart;

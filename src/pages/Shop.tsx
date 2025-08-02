import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { Contact } from "../components/Homepage/Contact";
import { Footer } from "../components/Homepage/Footer";
import { Filter } from "../components/shop/Filter";
import { Content } from "../components/shop/Content";
import container from "../assets/images/container.webp";
import { motion, AnimatePresence } from "framer-motion";
import { FiFilter } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

// SaleItem Component
interface SaleItemProps {
  image: string;
  title: string;
  price: string;
  onAddToCart?: () => void;
  onClick?: () => void;
}

const SaleItem = ({ image, title, price, onAddToCart }: SaleItemProps) => {
  const navigate = useNavigate();
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="flex bg-white p-3 cursor-pointer rounded-lg mb-3 shadow-sm hover:shadow-md transition-shadow"
      onClick={() => navigate("/product")}
    >
      <div className="w-1/3">
        <img
          src={image}
          alt={title}
          className="w-full h-28 object-contain bg-gray-50 rounded-lg"
        />
      </div>
      <div className="w-2/3 pl-3 flex flex-col justify-between">
        <div>
          <p className="text-sm font-medium mb-1 text-dark line-clamp-2">
            {title}
          </p>
          <p className="text-md font-bold text-dark mb-2">${price}</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onAddToCart}
          className="bg-light text-dark rounded py-3 px-2 text-lg font-bold hover:bg-light/90 transition-colors self-start"
        >
          Add to cart
        </motion.button>
      </div>
    </motion.div>
  );
};

// Dummy Data
const dummyProducts = [
  { id: 1, image: container, title: "20ft Standard Container", price: "1200" },
  { id: 2, image: container, title: "40ft High Cube Container", price: "2400" },
  {
    id: 3,
    image: container,
    title: "10ft Refrigerated Container",
    price: "1800",
  },
  { id: 4, image: container, title: "Flat Rack Container", price: "2100" },
  { id: 5, image: container, title: "Open Top Container", price: "1950" },
];

export const Shop = () => {
  const isDesktop = useMediaQuery({ minWidth: 1024 });
  const [showSidebar, setShowSidebar] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [cart, setCart] = useState<{ id: number; quantity: number }[]>([]);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const toggleMobileFilters = () => {
    setShowMobileFilters(!showMobileFilters);
  };

  const addToCart = (productId: number) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === productId);
      if (existing) {
        return prev.map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { id: productId, quantity: 1 }];
    });
    console.log(cart);
  };

  return (
    <div className="flex min-h-screen bg-gray-100 relative">
      {/* Sidebar - Only shown when toggled */}
      {showSidebar && (
        <div
          className={`fixed mt-16 lg:mt-0 z-30 top-0 h-screen overflow-y-auto transition-all duration-300 left-0`}
        >
          <Sidebar />
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Header */}
        <header className="sticky top-0 z-50 w-full">
          <Header onMenuClick={toggleSidebar} />
        </header>

        {/* Overlay for mobile sidebar */}
        {showSidebar && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20"
            onClick={toggleSidebar}
          />
        )}

        {/* Page Content */}
        <main className="flex-1 pt-2 px-4">
          {/* Desktop Layout */}
          {isDesktop ? (
            <div className="flex">
              {/* Filters - Left Side */}
              <div className="w-1/4 pr-4">
                <Filter />
              </div>

              {/* Product List - Middle */}
              <div className="w-2/4 px-2">
                <div className="space-y-4">
                  {dummyProducts.map((product) => (
                    <SaleItem
                      key={product.id}
                      image={product.image}
                      title={product.title}
                      price={product.price}
                      onAddToCart={() => addToCart(product.id)}
                    />
                  ))}
                </div>
              </div>

              {/* Content - Right Side */}
              <div className="w-1/4 pl-4">
                <Content />
              </div>
            </div>
          ) : (
            /* Mobile Layout */
            <div className="flex flex-col">
              {/* Mobile Filter Button */}
              <motion.button
                onClick={toggleMobileFilters}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center bg-white p-3 rounded-lg shadow-sm mb-4"
              >
                <FiFilter className="mr-2" />
                <span className="text-sm font-medium">Filters</span>
              </motion.button>

              {/* Mobile Filter Popup */}
              <AnimatePresence>
                {showMobileFilters && (
                  <>
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.2 }}
                      className="bg-white rounded-lg shadow-lg p-4 mb-4 z-10"
                    >
                      <Filter />
                    </motion.div>
                    <div
                      className="fixed inset-0 bg-black bg-opacity-30 z-0"
                      onClick={toggleMobileFilters}
                    />
                  </>
                )}
              </AnimatePresence>

              {/* Product List */}
              <div className="space-y-3 mb-4">
                {dummyProducts.map((product) => (
                  <SaleItem
                    key={product.id}
                    image={product.image}
                    title={product.title}
                    price={product.price}
                    onAddToCart={() => addToCart(product.id)}
                  />
                ))}
              </div>

              {/* Content */}
              <div className="bg-white rounded-lg shadow-sm p-4">
                <Content />
              </div>
            </div>
          )}

          <footer className="mt-8">
            <Contact />
            <Footer />
          </footer>
        </main>
      </div>
    </div>
  );
};

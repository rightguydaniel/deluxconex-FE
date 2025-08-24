import { useNavigate } from "react-router-dom";
import container from "../../assets/images/container.webp";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import api from "../../services/api";

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  categories: string[];
}

export const SaleSection = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get("/products/products?limit=5");

        if (response.status < 200 || response.status >= 300) {
          throw new Error(`Failed to fetch products: ${response.status}`);
        }

        const data = response.data;

        if (data.success) {
          setProducts(data.data.products || []);
        } else {
          throw new Error(data.message || "Failed to fetch products");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleCategoryClick = (categoryName: string) => {
    const encodedCategory = encodeURIComponent(categoryName);
    navigate(`/shop/${encodedCategory}`);
  };

  const handleShopAllClick = () => {
    navigate("/shop");
  };

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  const filterButtons = [
    { label: "Buy containers", category: "buy" },
    { label: "Rent containers", category: "rent" },
    { label: "Cold storage", category: "cold storage" },
    { label: "Office containers", category: "office containers" },
    { label: "Custom containers", category: "parts" },
  ];

  if (loading) {
    return (
      <div className="py-10 md:py-20 px-4 md:px-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h3 className="text-dark text-2xl md:text-3xl font-bold">
            Shipping containers for sale
          </h3>
          <div className="text-dark py-2 px-6 md:py-4 md:px-8 border-2 border-dark font-medium rounded whitespace-nowrap opacity-50">
            Shop all containers
          </div>
        </div>
        <div className="flex justify-center items-center h-40">
          <p className="text-gray-500">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-10 md:py-20 px-4 md:px-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h3 className="text-dark text-2xl md:text-3xl font-bold">
            Shipping containers for sale
          </h3>
        </div>
        <div className="flex justify-center items-center h-40">
          <p className="text-red-500">
            Please check your internet connection and reload the page
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10 md:py-20 px-4 md:px-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h3 className="text-dark text-2xl md:text-3xl font-bold">
          Shipping containers for sale
        </h3>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="text-dark py-2 px-6 md:py-4 md:px-8 border-2 border-dark font-medium rounded whitespace-nowrap hover:bg-dark hover:text-white"
          onClick={handleShopAllClick}
        >
          Shop all containers
        </motion.button>
      </div>

      {/* Filter Buttons */}
      <div className="mb-6 overflow-x-auto scrollbar-hide">
        <div className="flex space-x-2 md:space-x-4 w-max md:w-full">
          {filterButtons.map((button, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-dark font-medium hover:bg-dark hover:text-white border border-gray-300 px-4 py-2 rounded-lg"
              onClick={() => handleCategoryClick(button.category)}
            >
              {button.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Sale Items */}
      <div className="overflow-x-auto scrollbar-hide pb-4">
        <div className="flex space-x-4 md:space-x-6 w-max md:w-full py-4">
          {products.map((product) => (
            <motion.div
              key={product.id}
              whileHover={{ y: -5 }}
              className="cursor-pointer group min-w-[180px] md:min-w-[220px]"
              onClick={() => handleProductClick(product.id)}
            >
              <div className="bg-gray-300 p-4 md:p-6 rounded h-[180px] flex items-center justify-center">
                <img
                  src={
                    product.images && product.images.length > 0
                      ? product.images[0]
                      : container
                  }
                  alt={product.name}
                  className="w-full h-auto max-h-[140px] object-contain"
                />
              </div>
              <p className="text-dark mt-3 group-hover:text-blue-500 transition-colors duration-200 text-sm md:text-base text-center">
                {product.name}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Show message if no products */}
      {products.length === 0 && (
        <div className="flex justify-center items-center h-40">
          <p className="text-gray-500">No products available</p>
        </div>
      )}
    </div>
  );
};

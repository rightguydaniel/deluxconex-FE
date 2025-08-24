import { useMediaQuery } from "react-responsive";
import { Contact } from "../components/Homepage/Contact";
import { Footer } from "../components/Homepage/Footer";
import { useState, useRef, useEffect } from "react";
import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";
import { motion } from "framer-motion";
import { RiCustomerService2Line } from "react-icons/ri";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

interface ProductSpec {
  title?: string;
  value?: string;
}

interface ProductDimensionCondition {
  condition: string;
  price: number;
  images: string[];
  description: string;
  specifications: (string | ProductSpec)[];
}

interface ProductDimension {
  dimension: string;
  price?: number;
  description?: string;
  specifications?: (string | ProductSpec)[];
  conditions?: ProductDimensionCondition[];
  images?: string[];
}

interface ProductDelivery {
  method: string;
  price: number;
}

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  description: string;
  specifications: (string | ProductSpec)[];
  images: string[];
  dimensions: ProductDimension[];
  delivery: ProductDelivery[];
}

export interface CartItem {
  productId: string;
  name: string;
  basePrice: number; // The base price from the product
  quantity: number;
  image: string; // Main product image or selected variant image
  selectedDimension?: {
    dimension: string;
    priceAdjustment?: number; // Price difference from base price
  };
  selectedCondition?: {
    condition: string;
    priceAdjustment?: number; // Price difference from base price
  };
  selectedDelivery?: {
    method: string;
    price: number;
  };
  // Calculated fields
  itemPrice: number; // Final price per item (base + dimension adj + condition adj)
  totalPrice: number; // itemPrice * quantity
}

export const Product = () => {
  const { id } = useParams<{ id: string }>();
  const isLargeScreen = useMediaQuery({ minWidth: 1024 });
  const [showSidebar, setShowSidebar] = useState(isLargeScreen);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState<"description" | "specifications">(
    "description"
  );
  const [selectedDimension, setSelectedDimension] = useState<string | null>(
    null
  );
  const [selectedCondition, setSelectedCondition] = useState<string | null>(
    null
  );
  const [selectedDelivery, setSelectedDelivery] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/products/${id}`);

        const data = response.data.data;
        console.log(data);

        // Parse specifications if they're stored as JSON strings
        const parsedData = {
          ...data,
          specifications:
            typeof data.specifications === "string"
              ? JSON.parse(data.specifications)
              : data.specifications,
          dimensions: data.dimensions.map((dim: any) => ({
            ...dim,
            specifications:
              typeof dim.specifications === "string"
                ? JSON.parse(dim.specifications)
                : dim.specifications,
            conditions:
              dim.conditions?.map((cond: any) => ({
                ...cond,
                specifications:
                  typeof cond.specifications === "string"
                    ? JSON.parse(cond.specifications)
                    : cond.specifications,
              })) || [],
          })),
        };

        setProduct(parsedData);

        // Auto-select the first dimension if there's only one
        if (parsedData.dimensions.length === 1) {
          setSelectedDimension(parsedData.dimensions[0].dimension);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const scrollToContact = () => {
    contactRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Get current display content based on selections
  const getDisplayContent = () => {
    if (!product) {
      return {
        description: "",
        specifications: [],
        images: [],
      };
    }

    // If no dimensions or nothing selected, use product defaults
    if (
      product.dimensions.length === 0 ||
      (!selectedDimension && !selectedCondition)
    ) {
      return {
        description: product.description,
        specifications: product.specifications,
        images: product.images,
      };
    }

    // Find selected dimension
    const dimensionObj = product.dimensions.find(
      (d) => d.dimension === selectedDimension
    );
    if (!dimensionObj) {
      return {
        description: product.description,
        specifications: product.specifications,
        images: product.images,
      };
    }

    // Handle dimension without conditions
    if (!dimensionObj.conditions || dimensionObj.conditions.length === 0) {
      return {
        description: dimensionObj.description || product.description,
        specifications: dimensionObj.specifications || product.specifications,
        images: dimensionObj.images || product.images,
      };
    }

    // Handle dimension with conditions
    if (selectedCondition) {
      const conditionObj = dimensionObj.conditions.find(
        (c) => c.condition === selectedCondition
      );
      if (conditionObj) {
        return {
          description:
            conditionObj.description ||
            dimensionObj.description ||
            product.description,
          specifications:
            conditionObj.specifications ||
            dimensionObj.specifications ||
            product.specifications,
          images: conditionObj.images || dimensionObj.images || product.images,
        };
      }
    }

    // Default to dimension info if condition not selected
    return {
      description: dimensionObj.description || product.description,
      specifications: dimensionObj.specifications || product.specifications,
      images: dimensionObj.images || product.images,
    };
  };

  const {
    description,
    specifications,
    images: currentImages,
  } = getDisplayContent();

  const handleDimensionClick = (dimension: string) => {
    setSelectedDimension(dimension);
    setSelectedCondition(null);
    setSelectedImage(0);
  };

  const handleConditionClick = (condition: string) => {
    setSelectedCondition(condition);
    setSelectedImage(0);
  };

  const handleDeliveryClick = (method: string) => {
    setSelectedDelivery(method);
  };

  const handleQuantityChange = (value: number) => {
    if (value < 1) return;
    setQuantity(value);
  };

  const getCurrentPrice = (): number => {
    if (!product) return 0;

    // If no dimensions, use product price
    if (product.dimensions.length === 0) return product.price;

    // Find selected dimension
    const dimensionObj = product.dimensions.find(
      (d) => d.dimension === selectedDimension
    );
    if (!dimensionObj) return product.price;

    // Dimension without conditions
    if (!dimensionObj.conditions || dimensionObj.conditions.length === 0) {
      return dimensionObj.price || product.price;
    }

    // Dimension with conditions
    if (selectedCondition) {
      const conditionObj = dimensionObj.conditions.find(
        (c) => c.condition === selectedCondition
      );
      return conditionObj?.price || dimensionObj.price || product.price;
    }

    return dimensionObj.price || product.price;
  };

  const getDeliveryPrice = (): number => {
    if (!product || !selectedDelivery) return 0;
    const deliveryObj = product.delivery.find(
      (d) => d.method === selectedDelivery
    );
    return deliveryObj?.price || 0;
  };

  const basePrice = getCurrentPrice();
  const deliveryPrice = getDeliveryPrice();
  const totalPrice = (basePrice + deliveryPrice) * quantity;

  const handleAddToCart = async () => {
    if (!product) return;

    // Check if user is authenticated
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userId =
      typeof user === "object" && user !== null ? user.id : undefined;

    if (!token || !userId) {
      // Navigate to auth page if not authenticated
      navigate("/auth");
      return;
    }

    try {
      // Calculate price adjustments
      const dimensionPriceAdjustment = selectedDimension
        ? basePrice - product.price
        : 0;

      const cartItem: CartItem = {
        productId: product.id,
        name: product.name,
        basePrice: product.price, // Original product price
        quantity: quantity,
        image: currentImages[0] || product.images[0],
        selectedDimension: selectedDimension
          ? {
              dimension: selectedDimension,
              priceAdjustment: dimensionPriceAdjustment,
            }
          : undefined,
        selectedCondition: selectedCondition
          ? {
              condition: selectedCondition,
              priceAdjustment: 0, // You might want to calculate this if conditions affect price
            }
          : undefined,
        selectedDelivery: selectedDelivery
          ? {
              method: selectedDelivery,
              price: deliveryPrice,
            }
          : undefined,
        itemPrice: basePrice, // Final price per item after adjustments
        totalPrice: totalPrice, // itemPrice * quantity
      };

      // Call the API to add to cart
      const response = await api.post("user/cart", cartItem, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status < 200 || response.status >= 300) {
        throw new Error("Failed to add item to cart");
      }

      const data = response.data;

      if (data.status === "success") {
        // Show success popup with options
        const shouldCheckout = window.confirm(
          `Added to cart successfully!\n\n` +
            `Item: ${quantity} x ${product.name}\n` +
            `Price per unit: $${basePrice.toLocaleString()}\n` +
            `${selectedDimension ? `Dimension: ${selectedDimension}\n` : ""}` +
            `${selectedCondition ? `Condition: ${selectedCondition}\n` : ""}` +
            `${
              selectedDelivery
                ? `Delivery: ${selectedDelivery} ($${deliveryPrice})\n`
                : ""
            }` +
            `Total: $${totalPrice.toLocaleString()}\n\n` +
            `Click OK to proceed to checkout, or Cancel to continue shopping.`
        );

        if (shouldCheckout) {
          navigate("/dashboard/cart");
        }
      } else {
        throw new Error(data.message || "Failed to add item to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add item to cart. Please try again.");
    }
  };

  // Check if dimension has conditions
  const dimensionHasConditions = (dimension: string): boolean => {
    if (!product) return false;
    const dimensionObj = product.dimensions.find(
      (d) => d.dimension === dimension
    );
    return !!dimensionObj?.conditions && dimensionObj.conditions.length > 0;
  };

  // Render specifications either as list or table
  const renderSpecifications = (specs: (string | ProductSpec)[]) => {
    return (
      <div className="space-y-4">
        {specs.map((spec, index) => {
          if (typeof spec === "string") {
            return (
              <div
                key={index}
                className="flex py-2 border-b border-gray-100 last:border-0"
              >
                <span className="text-gray-700">{spec}</span>
              </div>
            );
          } else {
            return (
              <div
                key={index}
                className="flex py-2 border-b border-gray-100 last:border-0"
              >
                <span className="font-medium text-dark min-w-[120px]">
                  {spec.title}:
                </span>
                <span className="text-gray-700">{spec.value}</span>
              </div>
            );
          }
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100 items-center justify-center">
        <div className="text-xl">Loading product...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex min-h-screen bg-gray-100 items-center justify-center">
        <div className="text-xl text-red-500">
          {error || "Product not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100 relative">
      {/* Sidebar */}
      {showSidebar && (
        <div
          className={`fixed lg:sticky z-30 top-0 h-screen overflow-y-auto transition-all duration-300 ${
            showSidebar ? "left-0" : "-left-64"
          }`}
        >
          <Sidebar />
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <header className="lg:hidden sticky top-0 z-50 w-full">
          <Header onMenuClick={toggleSidebar} />
        </header>

        {showSidebar && !isLargeScreen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={toggleSidebar}
          />
        )}

        <main className="flex-1 pt-16 lg:pt-0">
          <div className="container mx-auto p-4 lg:p-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left Column - Images */}
              <div className="lg:w-1/2 flex flex-col">
                {/* Main Image */}
                <div className="bg-white rounded-lg shadow-md p-4 mb-4 flex-1 flex items-center">
                  {currentImages.length > 0 ? (
                    <img
                      src={currentImages[selectedImage]}
                      alt={`${product.name} ${selectedDimension || ""} ${
                        selectedCondition || ""
                      }`}
                      className="w-full h-auto max-h-80 object-contain"
                    />
                  ) : (
                    <div className="w-full h-80 flex items-center justify-center text-gray-500">
                      No image available
                    </div>
                  )}
                </div>

                {/* Thumbnail Gallery */}
                {currentImages.length > 0 && (
                  <div className="bg-white rounded-lg shadow-md p-4">
                    <div className="flex overflow-x-auto pb-2 gap-2">
                      {currentImages.map((image, index) => (
                        <motion.div
                          key={index}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`flex-shrink-0 cursor-pointer border-2 ${
                            selectedImage === index
                              ? "border-dark"
                              : "border-transparent"
                          } rounded-md`}
                          onClick={() => setSelectedImage(index)}
                        >
                          <img
                            src={image}
                            alt={`Thumbnail ${index + 1}`}
                            className="h-16 w-16 object-cover rounded-md"
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column - Product Info */}
              <div className="lg:w-1/2">
                <div className="bg-white rounded-lg shadow-md p-6 h-full flex flex-col">
                  <h1 className="text-2xl lg:text-3xl font-bold mb-2">
                    {product.name}
                  </h1>
                  {product.sku && (
                    <p className="text-gray-600 mb-4">SKU: {product.sku}</p>
                  )}

                  {/* Dimensions - Only show if dimensions exist and more than one */}
                  {product.dimensions.length > 0 && (
                    <div className="mb-4">
                      <p className="font-medium mb-2">
                        {product.dimensions.length > 1
                          ? "Dimensions"
                          : "Dimension"}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {product.dimensions.map((item) => (
                          <motion.button
                            key={item.dimension}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`px-4 py-2 border rounded-lg ${
                              selectedDimension === item.dimension
                                ? "bg-dark text-light border-dark"
                                : "border-gray-300 hover:bg-gray-100"
                            }`}
                            onClick={() => handleDimensionClick(item.dimension)}
                          >
                            {item.dimension}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Conditions - Only show if dimension has conditions */}
                  {selectedDimension &&
                    dimensionHasConditions(selectedDimension) && (
                      <div className="mb-4">
                        <p className="font-medium mb-2">Conditions</p>
                        <div className="flex flex-wrap gap-2">
                          {product.dimensions
                            .find((d) => d.dimension === selectedDimension)
                            ?.conditions?.map((item) => (
                              <motion.button
                                key={item.condition}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`px-4 py-2 border rounded-lg ${
                                  selectedCondition === item.condition
                                    ? "bg-dark text-light border-dark"
                                    : "border-gray-300 hover:bg-gray-100"
                                }`}
                                onClick={() =>
                                  handleConditionClick(item.condition)
                                }
                              >
                                {item.condition}
                              </motion.button>
                            ))}
                        </div>
                      </div>
                    )}

                  {/* Price Display */}
                  <div className="mb-6">
                    <div>
                      <p className="text-3xl font-bold text-dark">
                        ${totalPrice.toLocaleString()}
                      </p>
                      {quantity > 1 && (
                        <p className="text-sm text-gray-600">
                          {quantity} x ${basePrice.toLocaleString()} each
                        </p>
                      )}
                      {deliveryPrice > 0 && selectedDelivery && (
                        <p className="text-sm text-gray-600">
                          Includes ${deliveryPrice} for {selectedDelivery}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Quantity Selector */}
                  <div className="mb-6">
                    <p className="font-medium mb-2">Quantity</p>
                    <div className="flex items-center gap-2">
                      <button
                        className="px-3 py-1 border rounded-lg hover:bg-gray-100"
                        onClick={() => handleQuantityChange(quantity - 1)}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) =>
                          handleQuantityChange(parseInt(e.target.value) || 1)
                        }
                        className="w-16 px-2 py-1 border rounded-lg text-center"
                      />
                      <button
                        className="px-3 py-1 border rounded-lg hover:bg-gray-100"
                        onClick={() => handleQuantityChange(quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Delivery */}
                  {product.delivery.length > 0 && (
                    <div className="mb-6">
                      <p className="font-medium mb-2">Delivery Options</p>
                      <div className="flex flex-wrap gap-2">
                        {product.delivery.map((item) => (
                          <motion.button
                            key={item.method}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`px-4 py-2 border rounded-lg ${
                              selectedDelivery === item.method
                                ? "bg-dark text-light border-dark"
                                : "border-gray-300 hover:bg-gray-100"
                            }`}
                            onClick={() => handleDeliveryClick(item.method)}
                          >
                            {item.method}{" "}
                            {item.price > 0 ? `(+$${item.price})` : ""}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full mb-4 bg-light text-dark py-3 px-6 rounded-lg font-bold hover:bg-light transition-colors"
                    onClick={handleAddToCart}
                  >
                    Add to Cart
                  </motion.button>

                  <div className="flex justify-between items-center bg-light rounded py-4 px-8 mt-8 md:mt-auto">
                    <div className="rounded-full bg-dark p-2">
                      <RiCustomerService2Line className="h-6 w-6 text-light" />
                    </div>
                    <p className="font-bold text-dark">Have questions?</p>
                    <button
                      className="py-2 px-3 border border-dark text-dark rounded-lg"
                      onClick={scrollToContact}
                    >
                      Get a quote
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs for Description/Specifications */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mt-8">
              <div className="flex border-b">
                <button
                  className={`flex-1 py-3 font-medium ${
                    activeTab === "description"
                      ? "text-dark border-b-2 border-dark"
                      : "text-gray-600"
                  }`}
                  onClick={() => setActiveTab("description")}
                >
                  Description
                </button>
                <button
                  className={`flex-1 py-3 font-medium ${
                    activeTab === "specifications"
                      ? "text-dark border-b-2 border-dark"
                      : "text-gray-600"
                  }`}
                  onClick={() => setActiveTab("specifications")}
                >
                  Specifications
                </button>
              </div>

              <div className="p-6">
                {activeTab === "description" ? (
                  <div>
                    <p className="text-gray-700 leading-relaxed">
                      {description}
                    </p>
                  </div>
                ) : (
                  renderSpecifications(specifications)
                )}
              </div>
            </div>
          </div>

          <footer className="mt-12" ref={contactRef}>
            <Contact />
            <Footer />
          </footer>
        </main>
      </div>
    </div>
  );
};

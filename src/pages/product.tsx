import { useMediaQuery } from "react-responsive";
import { Contact } from "../components/Homepage/Contact";
import { Footer } from "../components/Homepage/Footer";
import { useState, useRef } from "react";
import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";
import sampleImage from "../assets/images/container.webp";
import sampleImage2 from "../assets/images/container_chassis.webp";
import newConditionImage from "../assets/images/container.webp";
import likeNewImage from "../assets/images/warehousads.webp";
import usedGoodImage from "../assets/images/office_gray.svg";
import { motion } from "framer-motion";
import { RiCustomerService2Line } from "react-icons/ri";

// Type definitions
interface Condition {
  condition: string;
  price: number;
  images: string[];
}

interface Dimension {
  dimension: string;
  conditions: Condition[];
}

interface DeliveryOption {
  method: string;
  price: number;
}

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  images: string[];
  description: string;
  specifications: string[];
  dimensions: Dimension[];
  delivery: DeliveryOption[];
}

interface CartItem {
  id: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  dimension: string | null;
  condition: string | null;
  deliveryMethod: string | null;
  deliveryPrice: number;
  totalPrice: number;
  image: string;
}

export const Product = () => {
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
  const contactRef = useRef<HTMLDivElement>(null);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const scrollToContact = () => {
    contactRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const product: Product = {
    id: "cont-001",
    name: "Shipping Container",
    sku: "BSGH-JSGJ",
    price: 2650,
    images: [sampleImage, sampleImage2], // Default images when dimensions array is empty
    description:
      "Our premium shipping containers are built to withstand harsh conditions while protecting your cargo. Made from high-quality corten steel with reinforced corners, these containers feature hardwood flooring and secure locking mechanisms. Ideal for international shipping, on-site storage, or conversion projects.",
    specifications: [
      "Material: Corten Steel",
      "Dimensions: 20'L x 8'W x 8.5'H",
      "Tare Weight: 2,300 kg",
      "Max Payload: 28,200 kg",
      "Flooring: 28mm Marine Plywood",
      "Doors: Double door with lock rods",
      "Wind/Water Tight: Yes",
      "CSC Plate: Certified",
    ],
    // dimensions: [], // Empty array to test default behavior
    dimensions: [
      // Uncomment to test with dimensions
      {
        dimension: "20ft",
        conditions: [
          {
            condition: "New",
            price: 3000,
            images: [newConditionImage, sampleImage, sampleImage2],
          },
          {
            condition: "Used - Like New",
            price: 2650,
            images: [likeNewImage, sampleImage, sampleImage],
          },
          {
            condition: "Used - Good",
            price: 2200,
            images: [usedGoodImage, sampleImage, sampleImage],
          },
        ],
      },
      {
        dimension: "40ft",
        conditions: [
          {
            condition: "New",
            price: 4500,
            images: [newConditionImage, sampleImage, sampleImage2],
          },
          {
            condition: "Used - Like New",
            price: 3850,
            images: [likeNewImage, sampleImage, sampleImage],
          },
          {
            condition: "Used - Good",
            price: 3200,
            images: [usedGoodImage, sampleImage, sampleImage],
          },
        ],
      },
    ],
    delivery: [
      { method: "Pickup", price: 0 },
      { method: "Local Delivery", price: 250 },
      { method: "Nationwide Shipping", price: 850 },
    ],
  };

  // Get current images based on selected condition or use default images
  const getCurrentImages = (): string[] => {
    if (product.dimensions.length === 0) return product.images;
    if (!selectedDimension || !selectedCondition) return product.images;

    const dimensionObj = product.dimensions.find(
      (d) => d.dimension === selectedDimension
    );
    if (!dimensionObj) return product.images;

    const conditionObj = dimensionObj.conditions.find(
      (c) => c.condition === selectedCondition
    );
    return conditionObj?.images || product.images;
  };

  const currentImages = getCurrentImages();

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
    if (product.dimensions.length === 0) return product.price;
    if (!selectedDimension || !selectedCondition) return product.price;

    const dimensionObj = product.dimensions.find(
      (d) => d.dimension === selectedDimension
    );
    if (!dimensionObj) return product.price;

    const conditionObj = dimensionObj.conditions.find(
      (c) => c.condition === selectedCondition
    );
    return conditionObj?.price || product.price;
  };

  const getDeliveryPrice = (): number => {
    if (!selectedDelivery) return 0;
    const deliveryObj = product.delivery.find(
      (d) => d.method === selectedDelivery
    );
    return deliveryObj?.price || 0;
  };

  const basePrice = getCurrentPrice();
  const deliveryPrice = getDeliveryPrice();
  const totalPrice = (basePrice + deliveryPrice) * quantity;

  const handleAddToCart = () => {
    const cartItem: CartItem = {
      id: product.id,
      name: product.name,
      sku: product.sku,
      price: basePrice,
      quantity: quantity,
      dimension: selectedDimension,
      condition: selectedCondition,
      deliveryMethod: selectedDelivery,
      deliveryPrice: deliveryPrice,
      totalPrice: totalPrice,
      image: currentImages[0],
    };

    console.log("Added to cart:", cartItem);
    alert(
      `Added to cart: ${quantity} x ${product.name}\n` +
        `Price per unit: $${basePrice}\n` +
        `Delivery: ${selectedDelivery} ($${deliveryPrice})\n` +
        `Total: $${totalPrice}`
    );
  };

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
                  <img
                    src={currentImages[selectedImage]}
                    alt={`${product.name} ${selectedCondition || ""}`}
                    className="w-full h-auto max-h-80 object-contain"
                  />
                </div>

                {/* Thumbnail Gallery */}
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

                  {/* Dimensions - Only show if dimensions exist */}
                  {product.dimensions.length > 0 && (
                    <div className="mb-4">
                      <p className="font-medium mb-2">Dimensions</p>
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

                  {/* Conditions - Only show if dimension is selected */}
                  {selectedDimension &&
                    product.dimensions[0]?.conditions?.length > 0 && (
                      <div className="mb-4">
                        <p className="font-medium mb-2">Conditions</p>
                        <div className="flex flex-wrap gap-2">
                          {product.dimensions
                            .find((d) => d.dimension === selectedDimension)
                            ?.conditions.map((item) => (
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
                      {deliveryPrice > 0 && (
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
                    className="w-full bg-light text-white mb-4 py-3 px-6 rounded-lg font-bold hover:bg-light transition-colors"
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
                  <p className="text-gray-700 leading-relaxed">
                    {product.description}
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {product.specifications.map((spec, index) => (
                      <li
                        key={index}
                        className="flex py-2 border-b border-gray-100 last:border-0 list-disc"
                      >
                        {spec}
                      </li>
                    ))}
                  </ul>
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

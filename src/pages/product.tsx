import { useMediaQuery } from "react-responsive";
import { Contact } from "../components/Homepage/Contact";
import { Footer } from "../components/Homepage/Footer";
import { useState, useRef } from "react";
import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";
import sampleImage from "../assets/images/container.webp";
import sampleImage2 from "../assets/images/container_chassis.webp";
import { motion } from "framer-motion";
import { RiCustomerService2Line } from "react-icons/ri";

export const Product = () => {
  const isLargeScreen = useMediaQuery({ minWidth: 1024 });
  const [showSidebar, setShowSidebar] = useState(isLargeScreen);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState("description");
  const contactRef = useRef<HTMLDivElement>(null);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const scrollToContact = () => {
    contactRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const product = {
    name: "Shipping Container",
    sku: "BSGH-JSGJ",
    images: [
      sampleImage,
      sampleImage2,
      sampleImage,
      sampleImage,
      sampleImage,
      sampleImage,
      sampleImage,
    ],
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
    price: 2650,
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
        {/* Header - Only shown on small screens */}
        <header className="lg:hidden sticky top-0 z-50 w-full">
          <Header onMenuClick={toggleSidebar} />
        </header>

        {/* Overlay for mobile sidebar */}
        {showSidebar && !isLargeScreen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={toggleSidebar}
          />
        )}

        {/* Page Content */}
        <main className="flex-1 pt-16 lg:pt-0">
          <div className="container mx-auto p-4 lg:p-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left Column - Images */}
              <div className="lg:w-1/2 flex flex-col">
                {/* Main Image */}
                <div className="bg-white rounded-lg shadow-md p-4 mb-4 flex-1 flex items-center">
                  <img
                    src={product.images[selectedImage]}
                    alt={product.name}
                    className="w-full h-auto max-h-80 object-contain"
                  />
                </div>

                {/* Thumbnail Gallery */}
                <div className="bg-white rounded-lg shadow-md p-4">
                  <div className="flex overflow-x-auto pb-2 gap-2">
                    {product.images.map((image, index) => (
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
                  <p className="text-3xl font-bold text-dark mb-6">
                    ${product.price.toLocaleString()}
                  </p>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-light text-white py-3 px-6 rounded-lg font-bold hover:bg-light transition-colors"
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
              {/* Tab Headers */}
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

              {/* Tab Content */}
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

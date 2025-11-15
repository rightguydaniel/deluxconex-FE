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
import Swal from "sweetalert2";
import { Helmet } from "react-helmet-async";
import {
  buildCanonicalUrl,
  seoConfig,
  serializeJsonLd,
} from "../config/seo";

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
  colors?: string[];
}

export interface CartItem {
  productId: string;
  name: string;
  basePrice: number; // The base price from the product
  quantity: number;
  image: string; // Main product image or selected variant image
  selectedColor?: string;
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
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedDelivery, setSelectedDelivery] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const canonicalPath = product
    ? `/product/${product.id}`
    : id
    ? `/product/${id}`
    : "/product";
  const rawDescription = product?.description
    ? product.description.replace(/\s+/g, " ").trim()
    : "Explore detailed specifications, pricing, and delivery options for shipping containers available through DeluxConex.";
  const pageDescription = rawDescription.length > 155
    ? `${rawDescription.slice(0, 152)}...`
    : rawDescription;
  const pageTitle = product
    ? `${product.name} | ${seoConfig.siteName}`
    : `Shipping Container | ${seoConfig.siteName}`;
  const leadImage = product?.images?.[0];

  const productJsonLd = product
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        sku: product.sku,
        description: rawDescription,
        image: product.images,
        brand: {
          "@type": "Brand",
          name: seoConfig.siteName,
        },
        offers: [
          {
            "@type": "Offer",
            price: product.price,
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
            url: buildCanonicalUrl(canonicalPath),
          },
          ...product.dimensions
            .filter((dim) => typeof dim.price === "number")
            .map((dim) => ({
              "@type": "Offer",
              price: dim.price,
              priceCurrency: "USD",
              availability: "https://schema.org/InStock",
              itemOffered: {
                "@type": "Product",
                name: `${product.name} - ${dim.dimension}`,
              },
              url: buildCanonicalUrl(canonicalPath),
            })),
        ],
      }
    : null;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: buildCanonicalUrl("/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Shop",
        item: buildCanonicalUrl("/shop"),
      },
      ...(product
        ? [
            {
              "@type": "ListItem",
              position: 3,
              name: product.name,
              item: buildCanonicalUrl(canonicalPath),
            },
          ]
        : []),
    ],
  };
  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/products/${id}`);

        const data = response.data.data;

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
          colors:
            typeof data.colors === "string"
              ? JSON.parse(data.colors)
              : data.colors,
        };

        setProduct(parsedData);

        // Auto-select the first dimension if there's only one
        if (parsedData.dimensions.length === 1) {
          setSelectedDimension(parsedData.dimensions[0].dimension);
        }

        // Auto-select the first color if there's only one
        if (parsedData.colors && parsedData.colors.length === 1) {
          setSelectedColor(parsedData.colors[0]);
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

    if (product.colors && product.colors.length > 0 && !selectedColor) {
      await Swal.fire({
        title: "Color Required",
        text: "Please select a color for this product.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    // Check if user is authenticated
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!selectedDelivery) {
      Swal.fire({
        title: "Delivery Method Required",
        text: "Please select a delivery method.",
        icon: "warning",
        showCancelButton: true,
      });
      return;
    }
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
        selectedColor: selectedColor || undefined,
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
        const result = await Swal.fire({
          title: "Added to cart successfully!",
          html: `
            <p><strong>Item:</strong> ${quantity} x ${product.name}</p>
            <p><strong>Price per unit:</strong> $${basePrice.toLocaleString()}</p>
            ${
              selectedDimension
                ? `<p><strong>Dimension:</strong> ${selectedDimension}</p>`
                : ""
            }
            ${
              selectedCondition
                ? `<p><strong>Condition:</strong> ${selectedCondition}</p>`
                : ""
            }
            ${
              selectedColor
                ? `<p><strong>Color:</strong> ${selectedColor}</p>`
                : ""
            }
            ${
              selectedDelivery
                ? `<p><strong>Delivery:</strong> ${selectedDelivery} ($${deliveryPrice})</p>`
                : ""
            }
            <p><strong>Total:</strong> $${totalPrice.toLocaleString()}</p>
            <p>Click "Proceed to Checkout" to continue, or "Keep Shopping" to stay on this page.</p>
          `,
          icon: "success",
          showCancelButton: true,
          confirmButtonText: "Proceed to Checkout",
          cancelButtonText: "Keep Shopping",
        });

        const shouldCheckout = result.isConfirmed;

        if (shouldCheckout) {
          navigate("/dashboard/cart");
        }
      } else {
        throw new Error(data.message || "Failed to add item to cart");
      }
    } catch (error: any) {
      if (error.response.status === 401) {
        Swal.fire({
          title: "Login Required",
          text: "You need to log in to add items to your cart.",
          icon: "info",
          confirmButtonText: "Login",
          confirmButtonColor: "#071623",
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/auth");
          }
        });
      } else {
        Swal.fire({
          title: "Error",
          text:
            error instanceof Error
              ? error.message
              : "An error occurred while adding to cart.",
          icon: "error",
        });
      }
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
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={buildCanonicalUrl(canonicalPath)} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="product" />
        <meta property="og:url" content={buildCanonicalUrl(canonicalPath)} />
        {leadImage && <meta property="og:image" content={leadImage} />}
        <meta property="og:site_name" content={seoConfig.siteName} />
        <meta name="twitter:card" content="summary_large_image" />
        {seoConfig.twitterHandle && (
          <meta name="twitter:site" content={seoConfig.twitterHandle} />
        )}
        {leadImage && <meta name="twitter:image" content={leadImage} />}
        {product && (
          <>
            <meta name="product:price:amount" content={product.price.toString()} />
            <meta name="product:price:currency" content="USD" />
            <meta name="product:availability" content="in stock" />
          </>
        )}
        <script type="application/ld+json">
          {serializeJsonLd(breadcrumbJsonLd)}
        </script>
        {productJsonLd && (
          <script type="application/ld+json">
            {serializeJsonLd(productJsonLd)}
          </script>
        )}
      </Helmet>
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

                  {/* Colors - Only show if colors exist */}
                  {product.colors && product.colors.length > 0 && (
                    <div className="mb-4">
                      <p className="font-medium mb-2">Colors</p>
                      <div className="flex flex-wrap gap-2">
                        {product.colors.map((color) => {
                          const isSelected = selectedColor === color;
                          const label =
                            color.charAt(0).toUpperCase() + color.slice(1);
                          return (
                            <button
                              key={color}
                              type="button"
                              onClick={() =>
                                setSelectedColor(
                                  isSelected ? null : color
                                )
                              }
                              className={`px-4 py-2 border rounded-lg ${
                                isSelected
                                  ? "bg-dark text-light border-dark"
                                  : "border-gray-300 hover:bg-gray-100"
                              }`}
                            >
                              {label === "Berge" ? "Berge" : label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
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

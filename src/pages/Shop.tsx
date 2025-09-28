import { useState, useEffect, useCallback } from "react";
import { useMediaQuery } from "react-responsive";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { Contact } from "../components/Homepage/Contact";
import { Footer } from "../components/Homepage/Footer";
import { Filter } from "../components/shop/Filter";
import { Content } from "../components/shop/Content";
import container from "../assets/images/container.webp";
import { motion, AnimatePresence } from "framer-motion";
import { FiFilter, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import { Helmet } from "react-helmet-async";
import {
  buildCanonicalUrl,
  seoConfig,
  serializeJsonLd,
} from "../config/seo";

// Product Interface
type ProductSpecification =
  | string
  | {
      title?: string;
      value?: string;
      [key: string]: unknown;
    };

interface ProductCondition {
  condition: string;
  price: number;
  images: string[];
  description?: string;
  specifications?: ProductSpecification[];
}

interface ProductDimension {
  dimension: string;
  price?: number;
  images?: string[];
  description?: string;
  specifications?: ProductSpecification[];
  conditions?: ProductCondition[];
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
  description: string;
  images: string[];
  categories: string[];
  dimensions?: ProductDimension[];
  delivery?: DeliveryOption[];
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// SaleItem Component
interface SaleItemProps {
  product: Product;
  onAddToCart?: () => void;
  onClick?: () => void;
}

const SaleItem = ({ product, onAddToCart }: SaleItemProps) => {
  const navigate = useNavigate();

  return (
    <motion.article
      whileHover={{ y: -5 }}
      className="flex bg-white p-3 cursor-pointer rounded-lg mb-3 shadow-sm hover:shadow-md transition-shadow"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <div className="w-1/3">
        <img
          src={
            product.images && product.images.length > 0
              ? product.images[0]
              : container
          }
          alt={product.name}
          className="w-full h-28 object-contain bg-gray-50 rounded-lg"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="w-2/3 pl-3 flex flex-col justify-between">
        <div>
          <p className="text-sm font-medium mb-1 text-dark line-clamp-2">
            {product.name}
          </p>
          <p className="text-md font-bold text-dark mb-2">
            ${product.price.toLocaleString()}
          </p>
          {product.sku && (
            <p className="text-xs text-gray-500">SKU: {product.sku}</p>
          )}
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart?.();
          }}
          className="bg-light text-dark rounded py-3 px-2 text-lg font-bold hover:bg-light/90 transition-colors self-start"
        >
          Add to cart
        </motion.button>
      </div>
    </motion.article>
  );
};

export const Shop = () => {
  const { category } = useParams<{ category: string }>();
  const isDesktop = useMediaQuery({ minWidth: 1024 });
  const [showSidebar, setShowSidebar] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [, setCart] = useState<{ id: string; quantity: number }[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    hasNext: false,
    hasPrev: false,
  });
  const normalizedCategory = category
    ? decodeURIComponent(category).toLowerCase()
    : "";

  const buildInitialFilters = (): Record<string, string> =>
    normalizedCategory ? { category: normalizedCategory } : {};

  const [filters, setFilters] = useState<Record<string, string>>(buildInitialFilters);

  const areFiltersEqual = (
    first: Record<string, string>,
    second: Record<string, string>
  ) => {
    const firstKeys = Object.keys(first);
    const secondKeys = Object.keys(second);

    if (firstKeys.length !== secondKeys.length) {
      return false;
    }

    return firstKeys.every((key) => first[key] === second[key]);
  };

  const decodedCategory = category ? decodeURIComponent(category) : undefined;
  const formattedCategory = decodedCategory
    ? decodedCategory
        .split(/\s+/)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ")
    : undefined;
  const pageTitle = formattedCategory
    ? `${formattedCategory} Shipping Containers | ${seoConfig.siteName}`
    : `Shop Shipping Containers | ${seoConfig.siteName}`;
  const pageDescription = formattedCategory
    ? `Browse ${formattedCategory.toLowerCase()} shipping containers available for sale or rent. Compare dimensions, pricing, and delivery options nationwide.`
    : `Shop new, used, and custom shipping containers for sale or rent. Filter by size, condition, and delivery to find the right fit for your project.`;
  const canonicalPath = category ? `/shop/${category}` : "/shop";

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
      ...(formattedCategory
        ? [
            {
              "@type": "ListItem",
              position: 3,
              name: formattedCategory,
              item: buildCanonicalUrl(canonicalPath),
            },
          ]
        : []),
    ],
  };

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: formattedCategory ? `${formattedCategory} Containers` : "Shipping Containers",
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    itemListElement: products.map((product, index) => ({
      "@type": "Product",
      position: index + 1,
      name: product.name,
      sku: product.sku,
      offers: {
        "@type": "Offer",
        price: product.price,
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
        url: buildCanonicalUrl(`/product/${product.id}`),
      },
      image: product.images?.[0],
      url: buildCanonicalUrl(`/product/${product.id}`),
    })),
  };

  const fetchProducts = useCallback(
    async (page: number, appliedFilters: Record<string, string>) => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        params.set("page", page.toString());
        params.set("limit", "7");

        Object.entries(appliedFilters).forEach(([key, value]) => {
          if (value) {
            params.set(key, value);
          }
        });

        const response = await api.get(`/products/products?${params.toString()}`);

        if (response.status < 200 || response.status >= 300) {
          throw new Error(`Failed to fetch products: ${response.status}`);
        }

        const data = response.data;

        if (data.success) {
          setProducts(data.data.products || []);
          setPagination({
            currentPage: data.data.pagination.currentPage,
            totalPages: data.data.pagination.totalPages,
            totalProducts: data.data.pagination.totalProducts,
            hasNext: data.data.pagination.hasNext,
            hasPrev: data.data.pagination.hasPrev,
          });
        } else {
          throw new Error(data.message || "Failed to fetch products");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    setFilters((previous) => {
      if (normalizedCategory) {
        if (previous.category === normalizedCategory) {
          return previous;
        }
        return { ...previous, category: normalizedCategory };
      }

      if (!normalizedCategory && previous.category) {
        const rest: Record<string, string> = { ...previous };
        delete rest.category;
        return rest;
      }

      return previous;
    });
    setCurrentPage(1);
  }, [normalizedCategory]);

  useEffect(() => {
    fetchProducts(currentPage, filters);
  }, [fetchProducts, currentPage, filters]);

  const handleFilterChange = (nextFilters: Record<string, string>) => {
    setFilters((previous) => {
      const updated = { ...nextFilters };
      return areFiltersEqual(previous, updated) ? previous : updated;
    });
    setCurrentPage(1);
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const toggleMobileFilters = () => {
    setShowMobileFilters(!showMobileFilters);
  };

  const addToCart = (productId: string) => {
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
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;

    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100 relative">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-xl">Loading products...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-100 relative">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-xl text-red-500">{error}</div>
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
        <meta property="og:type" content="website" />
        <meta property="og:url" content={buildCanonicalUrl(canonicalPath)} />
        <meta property="og:site_name" content={seoConfig.siteName} />
        <meta name="twitter:card" content="summary_large_image" />
        {seoConfig.twitterHandle && (
          <meta name="twitter:site" content={seoConfig.twitterHandle} />
        )}
        <script type="application/ld+json">
          {serializeJsonLd(breadcrumbJsonLd)}
        </script>
        {products.length > 0 && (
          <script type="application/ld+json">
            {serializeJsonLd(itemListJsonLd)}
          </script>
        )}
      </Helmet>
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
          {/* Page Title */}
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-dark">
              {category ? `Category: ${category}` : "All Products"}
            </h1>
            <p className="text-gray-600">
              Showing {products.length} of {pagination.totalProducts} products
            </p>
          </div>

          {/* Desktop Layout */}
          {isDesktop ? (
            <div className="flex">
              {/* Filters - Left Side */}
              <div className="w-1/4 pr-4">
                <Filter
                  initialFilters={filters}
                  onFilter={handleFilterChange}
                />
              </div>

              {/* Product List - Middle */}
              <div className="w-2/4 px-2">
                <div className="space-y-4">
                  {products.map((product) => (
                    <SaleItem
                      key={product.id}
                      product={product}
                      onAddToCart={() => addToCart(product.id)}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex justify-center items-center mt-8 space-x-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={!pagination.hasPrev}
                      className={`p-2 rounded-lg border ${
                        pagination.hasPrev
                          ? "bg-white text-dark hover:bg-gray-100"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      <FiChevronLeft size={20} />
                    </button>

                    {Array.from(
                      { length: pagination.totalPages },
                      (_, i) => i + 1
                    ).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-10 h-10 rounded-lg border ${
                          currentPage === page
                            ? "bg-dark text-light"
                            : "bg-white text-dark hover:bg-gray-100"
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={!pagination.hasNext}
                      className={`p-2 rounded-lg border ${
                        pagination.hasNext
                          ? "bg-white text-dark hover:bg-gray-100"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      <FiChevronRight size={20} />
                    </button>
                  </div>
                )}
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
                      <Filter
                        initialFilters={filters}
                        onFilter={handleFilterChange}
                      />
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
                {products.map((product) => (
                  <SaleItem
                    key={product.id}
                    product={product}
                    onAddToCart={() => addToCart(product.id)}
                  />
                ))}
              </div>

              {/* Pagination for mobile */}
              {pagination.totalPages > 1 && (
                <div className="flex justify-center items-center my-4 space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={!pagination.hasPrev}
                    className={`p-2 rounded-lg border ${
                      pagination.hasPrev
                        ? "bg-white text-dark hover:bg-gray-100"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    <FiChevronLeft size={20} />
                  </button>

                  <span className="text-sm text-gray-600">
                    Page {currentPage} of {pagination.totalPages}
                  </span>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!pagination.hasNext}
                    className={`p-2 rounded-lg border ${
                      pagination.hasNext
                        ? "bg-white text-dark hover:bg-gray-100"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    <FiChevronRight size={20} />
                  </button>
                </div>
              )}

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

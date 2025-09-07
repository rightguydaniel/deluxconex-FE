import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiChevronLeft,
  FiChevronRight,
  FiRefreshCw,
} from "react-icons/fi";
import AdminLayout from "./AdminLayout";
import ProductForm from "./ProductForm";
import api from "../services/api";

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  images: string[];
  description: string;
  specifications: any[];
  dimensions: any[];
  delivery: any[];
  categories?: string[];
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  hasNext: boolean;
  hasPrev: boolean;
}

const ITEMS_PER_PAGE = 10;

const AdminProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    hasNext: false,
    hasPrev: false,
  });

  // Fetch products on component mount and when page or search term changes
  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/products", {
        params: {
          page: currentPage,
          limit: ITEMS_PER_PAGE,
          search: searchTerm || undefined,
        },
      });

      if (response.data.success) {
        setProducts(response.data.data.products || []);
        setPagination(response.data.data.pagination);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      setDeleting(productId);
      const response = await api.delete(`/admin/products/${productId}`);

      if (response.data.success) {
        // Refetch products to ensure pagination is correct
        fetchProducts();
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product");
    } finally {
      setDeleting(null);
    }
  };

  const handleSubmit = async (productData: Omit<Product, "id">) => {
    try {
      if (editingProduct) {
        // Edit existing product
        const formData = new FormData();
        formData.append("productData", JSON.stringify(productData));

        const response = await api.put(
          `/admin/products/${editingProduct.id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.data.success) {
          // Refetch products to ensure data is up to date
          fetchProducts();
          setIsFormOpen(false);
        }
      } else {
        // For new products, just refetch
        fetchProducts();
        setIsFormOpen(false);
      }
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Failed to save product");
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <FiRefreshCw className="animate-spin text-2xl text-blue-600" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Products</h1>
          <div className="flex space-x-3">
            <button
              onClick={fetchProducts}
              className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <FiRefreshCw className="mr-2" />
              Refresh
            </button>
            <button
              onClick={handleAddProduct}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiPlus className="mr-2" />
              Add Product
            </button>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch(e as unknown as React.ChangeEvent<HTMLInputElement>);
            }}
          >
            <input
              type="text"
              placeholder="Search products..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={handleSearch}
            />
          </form>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SKU
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="h-12 w-12 object-cover rounded"
                        />
                      ) : (
                        <div className="h-12 w-12 bg-gray-200 rounded flex items-center justify-center">
                          <span className="text-gray-400 text-xs">
                            No Image
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.sku}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${product.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          disabled={deleting === product.id}
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-600 hover:text-red-900 p-1"
                          disabled={deleting === product.id}
                        >
                          {deleting === product.id ? (
                            <FiRefreshCw className="animate-spin" />
                          ) : (
                            <FiTrash2 />
                          )}
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {products.length === 0 && (
            <div className="p-6 text-center text-gray-500">
              {searchTerm
                ? "No products found matching your search"
                : "No products found"}
            </div>
          )}

          {pagination.totalPages > 1 && (
            <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={!pagination.hasPrev}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={!pagination.hasNext}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{" "}
                    <span className="font-medium">
                      {(currentPage - 1) * ITEMS_PER_PAGE + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(
                        currentPage * ITEMS_PER_PAGE,
                        pagination.totalProducts
                      )}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium">
                      {pagination.totalProducts}
                    </span>{" "}
                    results
                  </p>
                </div>
                <div>
                  <nav
                    className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                    aria-label="Pagination"
                  >
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={!pagination.hasPrev}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Previous</span>
                      <FiChevronLeft className="h-5 w-5" />
                    </button>
                    {Array.from(
                      { length: pagination.totalPages },
                      (_, i) => i + 1
                    ).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === page
                            ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                            : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={!pagination.hasNext}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Next</span>
                      <FiChevronRight className="h-5 w-5" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isFormOpen && (
          <ProductForm
            product={editingProduct || undefined}
            onSubmit={handleSubmit}
            onClose={() => setIsFormOpen(false)}
          />
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default AdminProductsPage;

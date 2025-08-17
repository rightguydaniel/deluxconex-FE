import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiX, FiUpload, FiTrash2, } from 'react-icons/fi';

type ProductSpec = string | { title: string; value: string };

interface Condition {
  condition: string;
  price: number;
  images: string[];
  description?: string;
  specifications?: ProductSpec[];
}

interface Dimension {
  dimension: string;
  price?: number;
  images?: string[];
  description?: string;
  specifications?: ProductSpec[];
  conditions?: Condition[];
}

interface DeliveryOption {
  method: string;
  price: number;
}

interface Product {
  id?: string;
  name: string;
  sku: string;
  price: number;
  images: string[];
  description: string;
  specifications: ProductSpec[];
  dimensions: Dimension[];
  delivery: DeliveryOption[];
  categories?: string[];
}

interface ProductFormProps {
  product?: Product;
  onSubmit: (productData: Omit<Product, 'id'>) => void;
  onClose: () => void;
}

const ProductForm = ({ product, onSubmit, onClose }: ProductFormProps) => {
  const [formData, setFormData] = useState<Omit<Product, 'id'>>(product || {
    name: '',
    sku: '',
    price: 0,
    images: [],
    description: '',
    specifications: [],
    dimensions: [],
    delivery: [],
    categories: []
  });

  const [activeTab, setActiveTab] = useState('basic');
  const [newSpec, setNewSpec] = useState('');
  const [newSpecTitle, setNewSpecTitle] = useState('');
  const [newSpecValue, setNewSpecValue] = useState('');
  const [newDimension, setNewDimension] = useState('');
  const [newDeliveryMethod, setNewDeliveryMethod] = useState('');
  const [newDeliveryPrice, setNewDeliveryPrice] = useState(0);
  const [newCategory, setNewCategory] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newImages = files.map(file => URL.createObjectURL(file));
      setFormData({ ...formData, images: [...formData.images, ...newImages] });
    }
  };

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
  };

  const addSimpleSpecification = () => {
    if (newSpec.trim()) {
      setFormData({
        ...formData,
        specifications: [...formData.specifications, newSpec]
      });
      setNewSpec('');
    }
  };

  const addDetailedSpecification = () => {
    if (newSpecTitle.trim() && newSpecValue.trim()) {
      setFormData({
        ...formData,
        specifications: [...formData.specifications, { title: newSpecTitle, value: newSpecValue }]
      });
      setNewSpecTitle('');
      setNewSpecValue('');
    }
  };

  const removeSpecification = (index: number) => {
    const newSpecs = formData.specifications.filter((_, i) => i !== index);
    setFormData({ ...formData, specifications: newSpecs });
  };

  const addDimension = () => {
    if (newDimension.trim()) {
      setFormData({
        ...formData,
        dimensions: [...formData.dimensions, { dimension: newDimension }]
      });
      setNewDimension('');
    }
  };

  const updateDimension = (index: number, field: keyof Dimension, value: any) => {
    const newDimensions = [...formData.dimensions];
    newDimensions[index] = { ...newDimensions[index], [field]: value };
    setFormData({ ...formData, dimensions: newDimensions });
  };

  const removeDimension = (index: number) => {
    const newDimensions = formData.dimensions.filter((_, i) => i !== index);
    setFormData({ ...formData, dimensions: newDimensions });
  };

  const addDeliveryOption = () => {
    if (newDeliveryMethod.trim()) {
      setFormData({
        ...formData,
        delivery: [...formData.delivery, { method: newDeliveryMethod, price: newDeliveryPrice }]
      });
      setNewDeliveryMethod('');
      setNewDeliveryPrice(0);
    }
  };

  const removeDeliveryOption = (index: number) => {
    const newDelivery = formData.delivery.filter((_, i) => i !== index);
    setFormData({ ...formData, delivery: newDelivery });
  };

  const addCategory = () => {
    if (newCategory.trim()) {
      setFormData({
        ...formData,
        categories: [...(formData.categories || []), newCategory]
      });
      setNewCategory('');
    }
  };

  const removeCategory = (index: number) => {
    const newCategories = (formData.categories || []).filter((_, i) => i !== index);
    setFormData({ ...formData, categories: newCategories });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              {product ? 'Edit Product' : 'Add New Product'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <FiX size={24} />
            </button>
          </div>

          <div className="flex border-b border-gray-200 mb-6">
            {['basic', 'specs', 'dimensions', 'delivery', 'categories'].map(tab => (
              <button
                key={tab}
                className={`py-2 px-4 font-medium ${activeTab === tab ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            {activeTab === 'basic' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                    <input
                      type="text"
                      name="sku"
                      value={formData.sku}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Base Price ($)</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Images</label>
                  <div className="mt-1 flex items-center">
                    <label className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer">
                      <FiUpload className="mr-2" />
                      Upload Images
                      <input
                        type="file"
                        multiple
                        onChange={handleImageUpload}
                        className="sr-only"
                        accept="image/*"
                      />
                    </label>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.images.map((img, index) => (
                      <div key={index} className="relative">
                        <img
                          src={img}
                          alt={`Product ${index}`}
                          className="h-20 w-20 object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                        >
                          <FiX size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Simple Specifications</label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newSpec}
                      onChange={(e) => setNewSpec(e.target.value)}
                      placeholder="Add simple specification"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={addSimpleSpecification}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Add
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Detailed Specifications</label>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <input
                      type="text"
                      value={newSpecTitle}
                      onChange={(e) => setNewSpecTitle(e.target.value)}
                      placeholder="Title"
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      value={newSpecValue}
                      onChange={(e) => setNewSpecValue(e.target.value)}
                      placeholder="Value"
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={addDetailedSpecification}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Add Detailed Spec
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Specifications</label>
                  {formData.specifications.map((spec, index) => (
                    <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                      {typeof spec === 'string' ? (
                        <span className="flex-1">{spec}</span>
                      ) : (
                        <div className="flex-1">
                          <strong>{spec.title}:</strong> {spec.value}
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => removeSpecification(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'dimensions' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Add Dimension</label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newDimension}
                      onChange={(e) => setNewDimension(e.target.value)}
                      placeholder="Add dimension (e.g., 20ft)"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={addDimension}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Add
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {formData.dimensions.map((dim, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">{dim.dimension}</h3>
                        <button
                          type="button"
                          onClick={() => removeDimension(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FiTrash2 />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-2">
                        <div>
                          <label className="block text-sm text-gray-700 mb-1">Price</label>
                          <input
                            type="number"
                            value={dim.price || ''}
                            onChange={(e) => updateDimension(index, 'price', parseFloat(e.target.value) || 0)}
                            placeholder="Price"
                            className="w-full px-2 py-1 border border-gray-300 rounded"
                          />
                        </div>
                      </div>

                      <div className="mb-2">
                        <label className="block text-sm text-gray-700 mb-1">Description</label>
                        <textarea
                          value={dim.description || ''}
                          onChange={(e) => updateDimension(index, 'description', e.target.value)}
                          rows={2}
                          className="w-full px-2 py-1 border border-gray-300 rounded"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'delivery' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Add Delivery Option</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={newDeliveryMethod}
                      onChange={(e) => setNewDeliveryMethod(e.target.value)}
                      placeholder="Method (e.g., Local Delivery)"
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="number"
                      value={newDeliveryPrice}
                      onChange={(e) => setNewDeliveryPrice(parseFloat(e.target.value) || 0)}
                      placeholder="Price"
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={addDeliveryOption}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Add Delivery Option
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Delivery Options</label>
                  {formData.delivery.map((option, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div>
                        <span className="font-medium">{option.method}</span>: ${option.price.toFixed(2)}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeDeliveryOption(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'categories' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Add Category</label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      placeholder="Add category"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={addCategory}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Add
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Categories</label>
                  <div className="flex flex-wrap gap-2">
                    {(formData.categories || []).map((category, index) => (
                      <div key={index} className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                        <span>{category}</span>
                        <button
                          type="button"
                          onClick={() => removeCategory(index)}
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          <FiX size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {product ? 'Update Product' : 'Add Product'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProductForm;
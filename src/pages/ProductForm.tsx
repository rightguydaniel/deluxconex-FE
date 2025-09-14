import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FiX,
  FiUpload,
  FiTrash2,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import api from "../services/api";
import { parseDbField } from "../services/parseDbFields";
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
  onSubmit: (productData: Omit<Product, "id">) => void;
  onClose: () => void;
}

const CATEGORY_OPTIONS = [
  "containers",
  "office containers",
  "cold storage",
  "conjoined containers",
  "ground level office",
  "hazmat storage",
  "parts",
  "chasis",
  "rent",
];

const ProductForm = ({ product, onSubmit, onClose }: ProductFormProps) => {
  // const [productImages, setProductImages] = useState<File[]>([]);
  // const [conditionImages, setConditionImages] = useState<
  //   { dimensionIndex: number; conditionIndex: number; files: File[] }[]
  // >([]);
  const [productImageFiles, setProductImageFiles] = useState<File[]>([]);
  const [conditionImageFiles, setConditionImageFiles] = useState<
    {
      dimensionIndex: number;
      conditionIndex: number;
      files: File[];
    }[]
  >([]);

  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<Omit<Product, "id">>(
    product
      ? {
          ...product,
          images: parseDbField(product.images),
          specifications: parseDbField(product.specifications),
          dimensions: parseDbField(product.dimensions),
          delivery: parseDbField(product.delivery),
          categories: parseDbField(product.categories),
        }
      : {
          name: "",
          sku: "",
          price: 0,
          images: [],
          description: "",
          specifications: [],
          dimensions: [],
          delivery: [],
          categories: [],
        }
  );

  const [editing, setEditing] = useState(false);

  useEffect(() => {
    setEditing(formData.name.trim() !== "");
    console.log(editing);
  }, []);

  const [activeTab, setActiveTab] = useState("basic");
  const [newSpec, setNewSpec] = useState("");
  const [newSpecTitle, setNewSpecTitle] = useState("");
  const [newSpecValue, setNewSpecValue] = useState("");
  const [newDimension, setNewDimension] = useState("");
  const [newDeliveryMethod, setNewDeliveryMethod] = useState("");
  const [newDeliveryPrice, setNewDeliveryPrice] = useState(0);
  const [expandedDimensions, setExpandedDimensions] = useState<number[]>([]);
  const [expandedConditions, setExpandedConditions] = useState<
    { dimensionIndex: number; conditionIndex: number }[]
  >([]);
  const [newConditionSpec, setNewConditionSpec] = useState<{
    dimensionIndex: number;
    conditionIndex: number;
    spec: string;
  }>({ dimensionIndex: -1, conditionIndex: -1, spec: "" });
  const [newConditionSpecTitle, setNewConditionSpecTitle] = useState<{
    dimensionIndex: number;
    conditionIndex: number;
    title: string;
  }>({ dimensionIndex: -1, conditionIndex: -1, title: "" });
  const [newConditionSpecValue, setNewConditionSpecValue] = useState<{
    dimensionIndex: number;
    conditionIndex: number;
    value: string;
  }>({ dimensionIndex: -1, conditionIndex: -1, value: "" });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    if (type === "select-multiple" && e.target instanceof HTMLSelectElement) {
      const selectedOptions = Array.from(e.target.selectedOptions).map(
        (option) => option.value
      );
      setFormData({ ...formData, [name]: selectedOptions });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    target: "product" | "condition",
    dimensionIndex?: number,
    conditionIndex?: number
  ) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);

      if (target === "product") {
        // Store actual files
        setProductImageFiles((prev) => [...prev, ...files]);

        // Create preview URLs for display
        const newImages = files.map((file) => URL.createObjectURL(file));
        setFormData({
          ...formData,
          images: [...formData.images, ...newImages],
        });
      } else if (
        target === "condition" &&
        dimensionIndex !== undefined &&
        conditionIndex !== undefined
      ) {
        // Store the actual files with their positions
        setConditionImageFiles((prev) => [
          ...prev,
          { dimensionIndex, conditionIndex, files },
        ]);

        // Create preview URLs for display
        const newImages = files.map((file) => URL.createObjectURL(file));
        const newDimensions = [...formData.dimensions];
        const conditions = [...newDimensions[dimensionIndex].conditions!];
        conditions[conditionIndex] = {
          ...conditions[conditionIndex],
          images: [...conditions[conditionIndex].images, ...newImages],
        };
        newDimensions[dimensionIndex].conditions = conditions;
        setFormData({ ...formData, dimensions: newDimensions });
      }
    }
  };

  const removeImage = (
    index: number,
    target: "product" | "condition",
    dimensionIndex?: number,
    conditionIndex?: number
  ) => {
    if (target === "product") {
      // Remove from both display and file storage
      const newImages = formData.images.filter((_, i) => i !== index);
      const newFiles = productImageFiles.filter((_, i) => i !== index);

      setFormData({ ...formData, images: newImages });
      setProductImageFiles(newFiles);
    } else if (
      target === "condition" &&
      dimensionIndex !== undefined &&
      conditionIndex !== undefined
    ) {
      const newDimensions = [...formData.dimensions];
      const conditions = [...newDimensions[dimensionIndex].conditions!];

      // Remove from display
      conditions[conditionIndex] = {
        ...conditions[conditionIndex],
        images: conditions[conditionIndex].images.filter((_, i) => i !== index),
      };

      // Remove from file storage
      const conditionFileIndex = conditionImageFiles.findIndex(
        (item) =>
          item.dimensionIndex === dimensionIndex &&
          item.conditionIndex === conditionIndex
      );

      if (conditionFileIndex !== -1) {
        const updatedFiles = [...conditionImageFiles];
        const existingFiles = updatedFiles[conditionFileIndex].files;

        if (existingFiles.length === 1) {
          // Remove entire entry if this was the last file
          updatedFiles.splice(conditionFileIndex, 1);
        } else {
          // Remove specific file
          updatedFiles[conditionFileIndex] = {
            ...updatedFiles[conditionFileIndex],
            files: existingFiles.filter((_, i) => i !== index),
          };
        }
        setConditionImageFiles(updatedFiles);
      }

      newDimensions[dimensionIndex].conditions = conditions;
      setFormData({ ...formData, dimensions: newDimensions });
    }
  };

  const addSimpleSpecification = () => {
    if (newSpec.trim()) {
      setFormData({
        ...formData,
        specifications: [...formData.specifications, newSpec],
      });
      setNewSpec("");
    }
  };

  const addDetailedSpecification = () => {
    if (newSpecTitle.trim() && newSpecValue.trim()) {
      setFormData({
        ...formData,
        specifications: [
          ...formData.specifications,
          { title: newSpecTitle, value: newSpecValue },
        ],
      });
      setNewSpecTitle("");
      setNewSpecValue("");
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
        dimensions: [
          ...formData.dimensions,
          {
            dimension: newDimension,
            specifications: [],
            conditions: [],
          },
        ],
      });
      setNewDimension("");
    }
  };

  const updateDimension = (
    index: number,
    field: keyof Dimension,
    value: any
  ) => {
    const newDimensions = [...formData.dimensions];
    newDimensions[index] = { ...newDimensions[index], [field]: value };
    setFormData({ ...formData, dimensions: newDimensions });
  };

  const removeDimension = (index: number) => {
    const newDimensions = formData.dimensions.filter((_, i) => i !== index);
    setFormData({ ...formData, dimensions: newDimensions });
    setExpandedDimensions(expandedDimensions.filter((i) => i !== index));
  };

  const addConditionToDimension = (dimensionIndex: number) => {
    const newDimensions = [...formData.dimensions];
    if (!newDimensions[dimensionIndex].conditions) {
      newDimensions[dimensionIndex].conditions = [];
    }
    newDimensions[dimensionIndex].conditions!.push({
      condition: "",
      price: 0,
      images: [],
      description: "",
      specifications: [],
    });
    setFormData({ ...formData, dimensions: newDimensions });
  };

  const updateCondition = (
    dimensionIndex: number,
    conditionIndex: number,
    field: keyof Condition,
    value: any
  ) => {
    const newDimensions = [...formData.dimensions];
    const conditions = [...newDimensions[dimensionIndex].conditions!];
    conditions[conditionIndex] = {
      ...conditions[conditionIndex],
      [field]: value,
    };
    newDimensions[dimensionIndex].conditions = conditions;
    setFormData({ ...formData, dimensions: newDimensions });
  };

  const removeCondition = (dimensionIndex: number, conditionIndex: number) => {
    const newDimensions = [...formData.dimensions];
    newDimensions[dimensionIndex].conditions = newDimensions[
      dimensionIndex
    ].conditions!.filter((_, i) => i !== conditionIndex);
    setFormData({ ...formData, dimensions: newDimensions });
  };

  const addSpecificationToDimension = (
    dimensionIndex: number,
    spec: ProductSpec
  ) => {
    const newDimensions = [...formData.dimensions];
    if (!newDimensions[dimensionIndex].specifications) {
      newDimensions[dimensionIndex].specifications = [];
    }
    newDimensions[dimensionIndex].specifications!.push(spec);
    setFormData({ ...formData, dimensions: newDimensions });
  };

  const addSpecificationToCondition = (
    dimensionIndex: number,
    conditionIndex: number,
    spec: ProductSpec
  ) => {
    const newDimensions = [...formData.dimensions];
    const conditions = [...newDimensions[dimensionIndex].conditions!];
    if (!conditions[conditionIndex].specifications) {
      conditions[conditionIndex].specifications = [];
    }
    conditions[conditionIndex].specifications!.push(spec);
    newDimensions[dimensionIndex].conditions = conditions;
    setFormData({ ...formData, dimensions: newDimensions });
  };

  const addSimpleSpecToCondition = (
    dimensionIndex: number,
    conditionIndex: number
  ) => {
    const spec = newConditionSpec.spec.trim();
    if (
      spec &&
      newConditionSpec.dimensionIndex === dimensionIndex &&
      newConditionSpec.conditionIndex === conditionIndex
    ) {
      addSpecificationToCondition(dimensionIndex, conditionIndex, spec);
      setNewConditionSpec({ dimensionIndex: -1, conditionIndex: -1, spec: "" });
    }
  };

  const addDetailedSpecToCondition = (
    dimensionIndex: number,
    conditionIndex: number
  ) => {
    const title = newConditionSpecTitle.title.trim();
    const value = newConditionSpecValue.value.trim();
    if (
      title &&
      value &&
      newConditionSpecTitle.dimensionIndex === dimensionIndex &&
      newConditionSpecTitle.conditionIndex === conditionIndex &&
      newConditionSpecValue.dimensionIndex === dimensionIndex &&
      newConditionSpecValue.conditionIndex === conditionIndex
    ) {
      addSpecificationToCondition(dimensionIndex, conditionIndex, {
        title,
        value,
      });
      setNewConditionSpecTitle({
        dimensionIndex: -1,
        conditionIndex: -1,
        title: "",
      });
      setNewConditionSpecValue({
        dimensionIndex: -1,
        conditionIndex: -1,
        value: "",
      });
    }
  };

  const removeSpecificationFromDimension = (
    dimensionIndex: number,
    specIndex: number
  ) => {
    const newDimensions = [...formData.dimensions];
    newDimensions[dimensionIndex].specifications = newDimensions[
      dimensionIndex
    ].specifications!.filter((_, i) => i !== specIndex);
    setFormData({ ...formData, dimensions: newDimensions });
  };

  const removeSpecificationFromCondition = (
    dimensionIndex: number,
    conditionIndex: number,
    specIndex: number
  ) => {
    const newDimensions = [...formData.dimensions];
    const conditions = [...newDimensions[dimensionIndex].conditions!];
    conditions[conditionIndex].specifications = conditions[
      conditionIndex
    ].specifications!.filter((_, i) => i !== specIndex);
    newDimensions[dimensionIndex].conditions = conditions;
    setFormData({ ...formData, dimensions: newDimensions });
  };

  const toggleDimensionExpansion = (index: number) => {
    setExpandedDimensions((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const toggleConditionExpansion = (
    dimensionIndex: number,
    conditionIndex: number
  ) => {
    setExpandedConditions((prev) => {
      const existing = prev.find(
        (p) =>
          p.dimensionIndex === dimensionIndex &&
          p.conditionIndex === conditionIndex
      );
      return existing
        ? prev.filter(
            (p) =>
              p.dimensionIndex !== dimensionIndex ||
              p.conditionIndex !== conditionIndex
          )
        : [...prev, { dimensionIndex, conditionIndex }];
    });
  };

  const addDeliveryOption = () => {
    if (newDeliveryMethod.trim()) {
      setFormData({
        ...formData,
        delivery: [
          ...formData.delivery,
          { method: newDeliveryMethod, price: newDeliveryPrice },
        ],
      });
      setNewDeliveryMethod("");
      setNewDeliveryPrice(0);
    }
  };

  const removeDeliveryOption = (index: number) => {
    const newDelivery = formData.delivery.filter((_, i) => i !== index);
    setFormData({ ...formData, delivery: newDelivery });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      // Prepare form data for submission
      const formDataToSend = new FormData();

      // Clean up the form data by removing blob URLs before sending
      const cleanFormData = {
        ...formData,
        // For existing products, keep the image URLs, for new ones remove blob URLs
        images: formData.images.filter((img) => !img.startsWith("blob:")),
        dimensions: formData.dimensions.map((dimension) => ({
          ...dimension,
          conditions: dimension.conditions?.map((condition) => ({
            ...condition,
            // For existing products, keep the image URLs, for new ones remove blob URLs
            images: condition.images.filter((img) => !img.startsWith("blob:")),
          })),
        })),
      };

      // Add product data as JSON
      formDataToSend.append("productData", JSON.stringify(cleanFormData));

      // Add product image files
      productImageFiles.forEach((file) => {
        formDataToSend.append("productImages", file);
      });

      // Add condition image files
      conditionImageFiles.forEach(
        ({ dimensionIndex, conditionIndex, files }) => {
          files.forEach((file) => {
            formDataToSend.append(
              `conditionImages_${dimensionIndex}_${conditionIndex}`,
              file
            );
          });
        }
      );

      if (product && product.id) {
        // Update existing product - send both data and files
        const response = await api.put(
          `/admin/products/${product.id}`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.data) {
          onSubmit(response.data);
        }
      } else {
        // Create new product
        const response = await api.post("/admin/products", formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.data) {
          onSubmit(response.data);
        }
      }
    } catch (error: any) {
      console.error("Error submitting product:", error);
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };
  if (uploading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      >
        <motion.div
          initial={{ scale: 0.8, rotate: 0 }}
          animate={{ scale: 1, rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: 1,
            ease: "linear",
          }}
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </motion.div>
    );
  }
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
        className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              {product ? "Edit Product" : "Add New Product"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <FiX size={24} />
            </button>
          </div>

          <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
            {["basic", "specs", "dimensions", "delivery", "categories"].map(
              (tab) => (
                <button
                  key={tab}
                  className={`py-2 px-4 font-medium whitespace-nowrap ${
                    activeTab === tab
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              )
            )}
          </div>

          <form onSubmit={handleSubmit}>
            {activeTab === "basic" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name
                  </label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      SKU
                    </label>
                    <input
                      type="text"
                      name="sku"
                      value={formData.sku}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Base Price ($)
                    </label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Images
                  </label>
                  <div className="mt-1 flex items-center">
                    <label className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer">
                      <FiUpload className="mr-2" />
                      Upload Images
                      <input
                        type="file"
                        multiple
                        onChange={(e) => handleImageUpload(e, "product")}
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
                          onClick={() => removeImage(index, "product")}
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

            {activeTab === "specs" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Simple Specifications
                  </label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Detailed Specifications
                  </label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Specifications
                  </label>
                  {formData.specifications.map((spec, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 p-2 bg-gray-50 rounded"
                    >
                      {typeof spec === "string" ? (
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

            {activeTab === "dimensions" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Add Dimension
                  </label>
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
                  {formData.dimensions.map((dim, dimensionIndex) => (
                    <div
                      key={dimensionIndex}
                      className="p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={() =>
                              toggleDimensionExpansion(dimensionIndex)
                            }
                            className="text-gray-500 hover:text-gray-700"
                          >
                            {expandedDimensions.includes(dimensionIndex) ? (
                              <FiChevronUp />
                            ) : (
                              <FiChevronDown />
                            )}
                          </button>
                          <h3 className="font-medium">{dim.dimension}</h3>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeDimension(dimensionIndex)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FiTrash2 />
                        </button>
                      </div>

                      {expandedDimensions.includes(dimensionIndex) && (
                        <div className="space-y-4 mt-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm text-gray-700 mb-1">
                                Price
                              </label>
                              <input
                                type="number"
                                value={dim.price || ""}
                                onChange={(e) =>
                                  updateDimension(
                                    dimensionIndex,
                                    "price",
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                                placeholder="Price"
                                className="w-full px-2 py-1 border border-gray-300 rounded"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm text-gray-700 mb-1">
                              Description
                            </label>
                            <textarea
                              value={dim.description || ""}
                              onChange={(e) =>
                                updateDimension(
                                  dimensionIndex,
                                  "description",
                                  e.target.value
                                )
                              }
                              rows={2}
                              className="w-full px-2 py-1 border border-gray-300 rounded"
                            />
                          </div>

                          {/* Dimension Specifications */}
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                              Dimension Specifications
                            </label>

                            {/* Simple Specification Input */}
                            <div className="flex space-x-2 mb-2">
                              <input
                                type="text"
                                value={newSpec}
                                onChange={(e) => setNewSpec(e.target.value)}
                                placeholder="Add simple specification"
                                className="flex-1 px-2 py-1 border border-gray-300 rounded"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  if (newSpec.trim()) {
                                    addSpecificationToDimension(
                                      dimensionIndex,
                                      newSpec
                                    );
                                    setNewSpec("");
                                  }
                                }}
                                className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
                              >
                                Add Simple
                              </button>
                            </div>

                            {/* Detailed Specification Input */}
                            <div className="grid grid-cols-2 gap-2 mb-2">
                              <input
                                type="text"
                                value={newSpecTitle}
                                onChange={(e) =>
                                  setNewSpecTitle(e.target.value)
                                }
                                placeholder="Title"
                                className="px-2 py-1 border border-gray-300 rounded"
                              />
                              <input
                                type="text"
                                value={newSpecValue}
                                onChange={(e) =>
                                  setNewSpecValue(e.target.value)
                                }
                                placeholder="Value"
                                className="px-2 py-1 border border-gray-300 rounded"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                if (
                                  newSpecTitle.trim() &&
                                  newSpecValue.trim()
                                ) {
                                  addSpecificationToDimension(dimensionIndex, {
                                    title: newSpecTitle,
                                    value: newSpecValue,
                                  });
                                  setNewSpecTitle("");
                                  setNewSpecValue("");
                                }
                              }}
                              className="px-3 py-1 bg-blue-600 text-white rounded text-sm mb-2"
                            >
                              Add Detailed Spec
                            </button>

                            {/* Current Specifications */}
                            {dim.specifications?.map((spec, specIndex) => (
                              <div
                                key={specIndex}
                                className="flex items-center space-x-2 p-2 bg-gray-50 rounded"
                              >
                                {typeof spec === "string" ? (
                                  <span className="flex-1">{spec}</span>
                                ) : (
                                  <div className="flex-1">
                                    <strong>{spec.title}:</strong> {spec.value}
                                  </div>
                                )}
                                <button
                                  type="button"
                                  onClick={() =>
                                    removeSpecificationFromDimension(
                                      dimensionIndex,
                                      specIndex
                                    )
                                  }
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <FiTrash2 size={14} />
                                </button>
                              </div>
                            ))}
                          </div>

                          {/* Conditions */}
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <label className="block text-sm font-medium text-gray-700">
                                Conditions
                              </label>
                              <button
                                type="button"
                                onClick={() =>
                                  addConditionToDimension(dimensionIndex)
                                }
                                className="px-3 py-1 bg-green-600 text-white rounded text-sm"
                              >
                                Add Condition
                              </button>
                            </div>
                            {dim.conditions?.map(
                              (condition, conditionIndex) => (
                                <div
                                  key={conditionIndex}
                                  className="p-3 border border-gray-200 rounded"
                                >
                                  <div className="flex justify-between items-center mb-2">
                                    <div className="flex items-center space-x-2">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          toggleConditionExpansion(
                                            dimensionIndex,
                                            conditionIndex
                                          )
                                        }
                                        className="text-gray-500 hover:text-gray-700"
                                      >
                                        {expandedConditions.some(
                                          (c) =>
                                            c.dimensionIndex ===
                                              dimensionIndex &&
                                            c.conditionIndex === conditionIndex
                                        ) ? (
                                          <FiChevronUp />
                                        ) : (
                                          <FiChevronDown />
                                        )}
                                      </button>
                                      <input
                                        type="text"
                                        value={condition.condition}
                                        onChange={(e) =>
                                          updateCondition(
                                            dimensionIndex,
                                            conditionIndex,
                                            "condition",
                                            e.target.value
                                          )
                                        }
                                        placeholder="Condition (e.g., New, Used)"
                                        className="px-2 py-1 border border-gray-300 rounded"
                                      />
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        removeCondition(
                                          dimensionIndex,
                                          conditionIndex
                                        )
                                      }
                                      className="text-red-500 hover:text-red-700"
                                    >
                                      <FiTrash2 />
                                    </button>
                                  </div>

                                  {expandedConditions.some(
                                    (c) =>
                                      c.dimensionIndex === dimensionIndex &&
                                      c.conditionIndex === conditionIndex
                                  ) && (
                                    <div className="space-y-3 mt-3">
                                      <div className="grid grid-cols-2 gap-3">
                                        <div>
                                          <label className="block text-sm text-gray-700 mb-1">
                                            Price
                                          </label>
                                          <input
                                            type="number"
                                            value={condition.price}
                                            onChange={(e) =>
                                              updateCondition(
                                                dimensionIndex,
                                                conditionIndex,
                                                "price",
                                                parseFloat(e.target.value) || 0
                                              )
                                            }
                                            className="w-full px-2 py-1 border border-gray-300 rounded"
                                          />
                                        </div>
                                      </div>

                                      <div>
                                        <label className="block text-sm text-gray-700 mb-1">
                                          Description
                                        </label>
                                        <textarea
                                          value={condition.description || ""}
                                          onChange={(e) =>
                                            updateCondition(
                                              dimensionIndex,
                                              conditionIndex,
                                              "description",
                                              e.target.value
                                            )
                                          }
                                          rows={2}
                                          className="w-full px-2 py-1 border border-gray-300 rounded"
                                        />
                                      </div>

                                      {/* Condition Images */}
                                      <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                          Condition Images
                                        </label>
                                        <div className="mt-1 flex items-center">
                                          <label className="inline-flex items-center px-3 py-1 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer">
                                            <FiUpload
                                              className="mr-1"
                                              size={14}
                                            />
                                            Upload Images
                                            <input
                                              type="file"
                                              multiple
                                              onChange={(e) =>
                                                handleImageUpload(
                                                  e,
                                                  "condition",
                                                  dimensionIndex,
                                                  conditionIndex
                                                )
                                              }
                                              className="sr-only"
                                              accept="image/*"
                                            />
                                          </label>
                                        </div>
                                        <div className="mt-2 flex flex-wrap gap-2">
                                          {condition.images.map(
                                            (img, imgIndex) => (
                                              <div
                                                key={imgIndex}
                                                className="relative"
                                              >
                                                <img
                                                  src={img}
                                                  alt={`Condition ${imgIndex}`}
                                                  className="h-16 w-16 object-cover rounded"
                                                />
                                                <button
                                                  type="button"
                                                  onClick={() =>
                                                    removeImage(
                                                      imgIndex,
                                                      "condition",
                                                      dimensionIndex,
                                                      conditionIndex
                                                    )
                                                  }
                                                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1"
                                                >
                                                  <FiX size={10} />
                                                </button>
                                              </div>
                                            )
                                          )}
                                        </div>
                                      </div>

                                      {/* Condition Specifications */}
                                      <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                          Condition Specifications
                                        </label>

                                        {/* Simple Specification Input */}
                                        <div className="flex space-x-2 mb-2">
                                          <input
                                            type="text"
                                            value={
                                              newConditionSpec.dimensionIndex ===
                                                dimensionIndex &&
                                              newConditionSpec.conditionIndex ===
                                                conditionIndex
                                                ? newConditionSpec.spec
                                                : ""
                                            }
                                            onChange={(e) =>
                                              setNewConditionSpec({
                                                dimensionIndex,
                                                conditionIndex,
                                                spec: e.target.value,
                                              })
                                            }
                                            placeholder="Add simple specification (e.g., Warranty: 2 years)"
                                            className="flex-1 px-2 py-1 border border-gray-300 rounded"
                                          />
                                          <button
                                            type="button"
                                            onClick={() =>
                                              addSimpleSpecToCondition(
                                                dimensionIndex,
                                                conditionIndex
                                              )
                                            }
                                            className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
                                          >
                                            Add
                                          </button>
                                        </div>

                                        {/* Detailed Specification Input */}
                                        <div className="grid grid-cols-2 gap-2 mb-2">
                                          <input
                                            type="text"
                                            value={
                                              newConditionSpecTitle.dimensionIndex ===
                                                dimensionIndex &&
                                              newConditionSpecTitle.conditionIndex ===
                                                conditionIndex
                                                ? newConditionSpecTitle.title
                                                : ""
                                            }
                                            onChange={(e) =>
                                              setNewConditionSpecTitle({
                                                dimensionIndex,
                                                conditionIndex,
                                                title: e.target.value,
                                              })
                                            }
                                            placeholder="Title"
                                            className="px-2 py-1 border border-gray-300 rounded"
                                          />
                                          <input
                                            type="text"
                                            value={
                                              newConditionSpecValue.dimensionIndex ===
                                                dimensionIndex &&
                                              newConditionSpecValue.conditionIndex ===
                                                conditionIndex
                                                ? newConditionSpecValue.value
                                                : ""
                                            }
                                            onChange={(e) =>
                                              setNewConditionSpecValue({
                                                dimensionIndex,
                                                conditionIndex,
                                                value: e.target.value,
                                              })
                                            }
                                            placeholder="Value"
                                            className="px-2 py-1 border border-gray-300 rounded"
                                          />
                                        </div>
                                        <button
                                          type="button"
                                          onClick={() =>
                                            addDetailedSpecToCondition(
                                              dimensionIndex,
                                              conditionIndex
                                            )
                                          }
                                          className="px-3 py-1 bg-blue-600 text-white rounded text-sm mb-2"
                                        >
                                          Add Detailed Spec
                                        </button>

                                        {/* Current Specifications */}
                                        {condition.specifications?.map(
                                          (spec, specIndex) => (
                                            <div
                                              key={specIndex}
                                              className="flex items-center space-x-2 p-2 bg-gray-50 rounded"
                                            >
                                              {typeof spec === "string" ? (
                                                <span className="flex-1">
                                                  {spec}
                                                </span>
                                              ) : (
                                                <div className="flex-1">
                                                  <strong>{spec.title}:</strong>{" "}
                                                  {spec.value}
                                                </div>
                                              )}
                                              <button
                                                type="button"
                                                onClick={() =>
                                                  removeSpecificationFromCondition(
                                                    dimensionIndex,
                                                    conditionIndex,
                                                    specIndex
                                                  )
                                                }
                                                className="text-red-500 hover:text-red-700"
                                              >
                                                <FiTrash2 size={14} />
                                              </button>
                                            </div>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "delivery" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Add Delivery Option
                  </label>
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
                      onChange={(e) =>
                        setNewDeliveryPrice(parseFloat(e.target.value) || 0)
                      }
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Delivery Options
                  </label>
                  {formData.delivery.map((option, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <div>
                        <span className="font-medium">{option.method}</span>: $
                        {option.price.toFixed(2)}
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

            {activeTab === "categories" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Categories
                  </label>
                  <select
                    name="categories"
                    multiple
                    value={formData.categories || []}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                  >
                    {CATEGORY_OPTIONS.map((category) => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                  <p className="text-sm text-gray-500 mt-1">
                    Hold Ctrl/Cmd to select multiple categories
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Selected Categories
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {(formData.categories || []).map((category, index) => (
                      <div
                        key={index}
                        className="flex items-center bg-blue-100 text-blue-800 rounded-full px-3 py-1"
                      >
                        <span>{category}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const newCategories = (
                              formData.categories || []
                            ).filter((_, i) => i !== index);
                            setFormData({
                              ...formData,
                              categories: newCategories,
                            });
                          }}
                          className="ml-2 text-blue-600 hover:text-blue-800"
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
                {product ? "Update Product" : "Add Product"}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProductForm;

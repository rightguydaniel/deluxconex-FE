import sampleImage from "../assets/images/container.webp";
import sampleImage2 from "../assets/images/container_chassis.webp";
import newConditionImage from "../assets/images/carriage-left.webp";
import likeNewImage from "../assets/images/Deluxconex.png";
import usedGoodImage from "../assets/images/ramps_0.webp";

// Type definitions
export type ProductSpec = string | { title: string; value: string };

export interface Condition {
  condition: string;
  price: number;
  images: string[];
  description?: string;
  specifications?: ProductSpec[];
}

export interface Dimension {
  dimension: string;
  price?: number;
  images?: string[];
  description?: string;
  specifications?: ProductSpec[];
  conditions?: Condition[];
}

export interface DeliveryOption {
  method: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  images: string[];
  description: string;
  specifications: ProductSpec[];
  dimensions: Dimension[];
  delivery: DeliveryOption[];
}

// Example product data with different scenarios
export const product: Product = {
  id: "cont-001",
  name: "Shipping Container",
  sku: "BSGH-JSGJ",
  price: 2650,
  images: [sampleImage, sampleImage2, likeNewImage],
  description: "Standard shipping container description",
  specifications: [
    "Material: Corten Steel",
    "Standard Dimensions: 20'L x 8'W x 8.5'H",
    { title: "Weight", value: "2,300 kg" },
    { title: "Max Payload", value: "28,200 kg" },
  ],
  dimensions: [
    // Single dimension with conditions (will be auto-selected)
    {
      dimension: "20ft",
      description: "20ft container description",
      specifications: [
        "Capacity: 33 m³",
        { title: "Max Weight", value: "28,000 kg" },
        { title: "Door Width", value: "2.3 m" },
      ],
      conditions: [
        {
          condition: "New",
          price: 3000,
          images: [newConditionImage, sampleImage, sampleImage2],
          description: "New 20ft container description",
          specifications: [
            "Warranty: 2 years",
            { title: "Finish", value: "Premium paint" },
            { title: "Inspection", value: "Full certification" },
          ],
        },
        {
          condition: "Used",
          price: 2200,
          images: [usedGoodImage],
          description: "Used 20ft container description",
          specifications: [
            { title: "Inspection", value: "Certified" },
            "Condition: Good",
            { title: "Age", value: "5 years" },
          ],
        },
      ],
    },
    // Dimension without conditions
    {
      dimension: "40ft",
      price: 4500,
      images: [sampleImage, sampleImage2],
      description: "40ft container description",
      specifications: [
        "Capacity: 67 m³",
        { title: "Max Weight", value: "30,000 kg" },
        "Special Features: High cube",
      ],
    },
  ],
  delivery: [
    { method: "Pickup", price: 0 },
    { method: "Local Delivery", price: 250 },
    { method: "Nationwide Shipping", price: 850 },
  ],
};

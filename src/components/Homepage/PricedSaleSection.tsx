import { useNavigate } from "react-router-dom";
import container from "../../assets/images/container.webp";
import { motion } from "framer-motion";

interface ContainerItem {
  name: string;
  price: string;
  image: string;
  alt: string;
}

interface FilterButton {
  label: string;
}

export const PricedSaleSection = () => {
  const navigate = useNavigate();

  const containerItems: ContainerItem[] = [
    {
      name: "20ft Shipping Container",
      price: "$100.00",
      image: container,
      alt: "20ft shipping container",
    },
    {
      name: "40ft Shipping Container",
      price: "$150.00",
      image: container,
      alt: "40ft shipping container",
    },
    {
      name: "High Cube Container",
      price: "$200.00",
      image: container,
      alt: "High cube shipping container",
    },
    {
      name: "Refrigerated Container",
      price: "$250.00",
      image: container,
      alt: "Refrigerated shipping container",
    },
    {
      name: "Open Top Container",
      price: "$180.00",
      image: container,
      alt: "Open top shipping container",
    },
    {
      name: "Flat Rack Container",
      price: "$220.00",
      image: container,
      alt: "Flat rack shipping container",
    },
  ];

  const filterButtons: FilterButton[] = [
    { label: "40ft" },
    { label: "20ft" },
    { label: "Ground level office" },
    { label: "Cold storage" },
    { label: "Custom containers" },
  ];

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
          className="text-dark py-2 px-6 md:py-4 md:px-8 border-2 border-dark font-medium rounded whitespace-nowrap hover:bg-dark hover:text-white transition-colors duration-200"
        >
          View all rentals
        </motion.button>
      </div>

      {/* Filter Buttons */}
      <div className="mb-6 overflow-x-auto scrollbar-hide">
        <div className="flex space-x-2 md:space-x-4 w-max md:w-full">
          {filterButtons.map((button, index) => (
            <motion.button
              key={index}
              whileHover={{ backgroundColor: "#1a1a1a", color: "#fff" }}
              whileTap={{ scale: 0.95 }}
              className="text-dark font-medium hover:bg-dark hover:text-white border border-gray-300 px-3 py-1 md:px-4 md:py-2 rounded-lg text-sm md:text-base whitespace-nowrap transition-colors duration-200"
            >
              {button.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Container Items */}
      <div className="overflow-x-auto scrollbar-hide pb-4">
        <div className="flex space-x-4 md:space-x-6 w-max md:w-full py-4">
          {containerItems.map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              className="cursor-pointer group min-w-[150px] md:min-w-[200px]"
              onClick={() => navigate("/product")}
            >
              <div className="bg-gray-200 p-4 md:p-6 rounded-lg h-[180px] flex items-center justify-center">
                <img
                  src={item.image}
                  alt={item.alt}
                  className="w-full h-auto max-h-[120px] md:max-h-[140px] object-contain"
                />
              </div>
              <p className="mt-3 font-bold text-base md:text-lg">
                {item.price}
              </p>
              <p className="text-dark mt-1 group-hover:text-blue-500 transition-colors duration-200 text-sm md:text-base">
                {item.name}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

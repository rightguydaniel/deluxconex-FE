import { useNavigate } from "react-router-dom";
import container from "../../assets/images/container.webp";
import { motion } from "framer-motion";

export const SaleSection = () => {
  const navigate = useNavigate();

  const saleItems = [
    {
      name: "20ft Standard Container",
      image: container,
      alt: "20ft shipping container",
    },
    {
      name: "40ft Standard Container",
      image: container,
      alt: "40ft shipping container",
    },
    {
      name: "High Cube Container",
      image: container,
      alt: "High cube shipping container",
    },
    {
      name: "Refrigerated Container",
      image: container,
      alt: "Refrigerated shipping container",
    },
    {
      name: "Open Top Container",
      image: container,
      alt: "Open top shipping container",
    },
    {
      name: "Flat Rack Container",
      image: container,
      alt: "Flat rack shipping container",
    },
  ];

  const filterButtons = [
    { label: "Buy containers" },
    { label: "Rent containers" },
    { label: "Cold storage" },
    { label: "Office containers" },
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
          className="text-dark py-2 px-6 md:py-4 md:px-8 border-2 border-dark font-medium rounded whitespace-nowrap hover:bg-dark hover:text-white"
        >
          Shop all containers
        </motion.button>
      </div>

      {/* Filter Buttons */}
      <div className="mb-6 overflow-x-auto scrollbar-hide">
        <div className="flex space-x-2 md:space-x-4 w-max md:w-full">
          {filterButtons.map((button, index) => (
            <motion.button
              key={index}
              className="text-dark font-medium hover:bg-dark hover:text-white border border-gray-300 px-4 py-2 rounded-lg"
            >
              {button.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Sale Items */}
      <div className="overflow-x-auto scrollbar-hide pb-4">
        <div className="flex space-x-4 md:space-x-6 w-max md:w-full py-4">
          {saleItems.map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              className="cursor-pointer group min-w-[180px] md:min-w-[220px]"
              onClick={() => navigate("/product")}
            >
              <div className="bg-gray-300 p-4 md:p-6 rounded h-[180px] flex items-center justify-center">
                <img
                  src={item.image}
                  alt={item.alt}
                  className="w-full h-auto max-h-[140px] object-contain"
                />
              </div>
              <p className="text-dark mt-3 group-hover:text-blue-500 transition-colors duration-200 text-sm md:text-base text-center">
                {item.name}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

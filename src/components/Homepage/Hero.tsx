import { motion } from "framer-motion";
import conjoined from "../../assets/images/conjoined.svg";
import fabrication from "../../assets/images/fabrication icon.svg";
import hazmat from "../../assets/images/hazmat_gray.svg";
import newGray from "../../assets/images/new_gray.svg";
import office from "../../assets/images/office_gray.svg";
import refrigeration from "../../assets/images/refrigeration icon.svg";
import { FaKey } from "react-icons/fa";
import { BsGearWideConnected } from "react-icons/bs";
import { Ri24HoursLine } from "react-icons/ri";
import video from "/top.mp4";
import React from "react";
import { FaTruckFast } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

export const Hero = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryName: string) => {
    const encodedCategory = encodeURIComponent(categoryName);
    navigate(`/shop/${encodedCategory}`);
  };

  const handleImageClick = (category: string) => {
    // Map category labels to appropriate category names for the URL
    const categoryMap: { [key: string]: string } = {
      "Hazmat storage": "hazmat storage",
      "Cold storage": "cold storage",
      "New containers": "new",
      "Conjoined containers": "conjoined containers",
      "Office containers": "office containers",
      Fabrication: "parts",
    };

    const categoryName = categoryMap[category] || "parts";
    handleCategoryClick(categoryName);
  };

  const handleShopNowClick = () => {
    navigate("/shop");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  const featureVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: (i: number) => ({
      x: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      },
    }),
  };

  const categories = [
    {
      img: hazmat,
      alt: "hazmat",
      label: "Hazmat storage",
    },
    {
      img: refrigeration,
      alt: "refrigeration",
      label: "Cold storage",
    },
    {
      img: newGray,
      alt: "New containers",
      label: "New containers",
    },
    {
      img: conjoined,
      alt: "Conjoined containers",
      label: "Conjoined containers",
    },
    {
      img: office,
      alt: "Office containers",
      label: "Office containers",
    },
    {
      img: fabrication,
      alt: "Fabrication",
      label: "Fabrication",
    },
  ];

  const features = [
    { icon: <FaKey />, lines: ["Turnkey", "solutions"] },
    { icon: <FaTruckFast />, lines: ["Serving 48", "states"] },
    { icon: <BsGearWideConnected />, lines: ["Container", "customizations"] },
    { icon: <Ri24HoursLine />, lines: ["Over 30,000+", "delivered orders"] },
  ];

  return (
    <div className="h-screen flex flex-col bg-dark/99">
      {/* Categories Section - Horizontal scroll on mobile */}
      <div className="w-full py-4 lg:py-6 overflow-hidden">
        <motion.div
          className="w-full flex items-center px-4 lg:px-20"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex-1 lg:flex lg:justify-between lg:items-center lg:gap-4 overflow-x-auto lg:overflow-x-visible scrollbar-hide whitespace-nowrap py-2">
            {categories.map((category, index) => (
              <motion.div
                key={index}
                className="cursor-pointer inline-flex flex-col items-center px-3 lg:px-4 mx-1 lg:mx-0"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleImageClick(category.label)}
              >
                <img
                  src={category.img}
                  alt={category.alt}
                  className="h-12 md:h-16 lg:h-20 brightness-75 hover:brightness-100 transition duration-300"
                />
                <p className="text-white text-xs md:text-sm font-medium text-center whitespace-nowrap mt-1">
                  {category.label}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Main Hero Section */}
      <div className="flex-1 relative overflow-hidden">
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
        >
          <source src={video} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Dark Overlay */}
        <div className="absolute top-0 left-0 w-full h-full bg-black/50 z-1"></div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-center px-4 md:px-8 lg:px-12">
          <motion.h3
            className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-center font-bold mb-6 md:mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Shipping Container Sales, Rentals & Mods
          </motion.h3>

          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <motion.button
              className="bg-light text-dark py-2 px-6 md:py-3 md:px-8 lg:py-4 lg:px-12 rounded text-base md:text-lg font-medium hover:bg-light/90 transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleShopNowClick}
            >
              Shop now
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Features Section - Horizontal scroll on mobile */}
      <div className="w-full py-4 lg:py-6 bg-dark/95 overflow-hidden">
        <motion.div
          className="flex items-center px-4"
          initial="hidden"
          animate="visible"
        >
          <div className="flex-1 lg:flex lg:justify-between lg:gap-12 xl:gap-20 overflow-x-auto lg:overflow-x-visible scrollbar-hide whitespace-nowrap py-2">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="inline-flex items-center space-x-2 md:space-x-4 px-4 lg:px-0"
                variants={featureVariants}
                custom={index}
              >
                <div className="text-light">
                  {React.cloneElement(feature.icon, {
                    className: "h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7",
                  })}
                </div>
                <div className="text-xs sm:text-sm text-white font-semibold">
                  {feature.lines.map((line, i) => (
                    <p key={i} className="whitespace-nowrap">
                      {line}
                    </p>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

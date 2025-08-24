// Sidebar.tsx
import { motion } from "framer-motion";
import logo from "../assets/images/Deluxconex.png";
import { useNavigate } from "react-router-dom";
import {
  FaHandshake,
  FaHammer,
  FaTruck,
  FaEnvelopeOpen,
  FaShoppingCart,
  FaTrailer,
} from "react-icons/fa";
import { TfiReload } from "react-icons/tfi";
import { BiHealth } from "react-icons/bi";
import { GrGallery } from "react-icons/gr";
import { IoSearch } from "react-icons/io5";
import { FiLogIn } from "react-icons/fi";
import { FaGears, FaMapLocationDot } from "react-icons/fa6";

// Create a separate component for category items
const CategoryItem = ({
  name,
  Icon,
  categoryName,
}: {
  name: string;
  Icon: React.ElementType;
  categoryName: string;
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    const encodedCategory = encodeURIComponent(categoryName);
    navigate(`/shop/${encodedCategory}`);
  };

  return (
    <motion.li
      whileHover={{ scale: 1.02, backgroundColor: "#0b2f45" }}
      whileTap={{ scale: 0.98 }}
      className="flex items-center py-2 pl-5 cursor-pointer rounded-lg group"
      onClick={handleClick}
    >
      <span className="mr-3">
        <Icon size="15" className="text-[#475367] group-hover:text-[#e7d8c2]" />
      </span>
      <span className="font-medium text-sm text-gray-400 leading-[145%] group-hover:text-white">
        {name}
      </span>
    </motion.li>
  );
};

// Regular Item component for non-category navigation
const Item = ({
  name,
  Icon,
  path,
}: {
  name: string;
  Icon: React.ElementType;
  path: string;
}) => {
  const navigate = useNavigate();

  return (
    <motion.li
      whileHover={{ scale: 1.02, backgroundColor: "#0b2f45" }}
      whileTap={{ scale: 0.98 }}
      className="flex items-center py-2 pl-5 cursor-pointer rounded-lg group"
      onClick={() => navigate(path)}
    >
      <span className="mr-3">
        <Icon size="15" className="text-[#475367] group-hover:text-[#e7d8c2]" />
      </span>
      <span className="font-medium text-sm text-gray-400 leading-[145%] group-hover:text-white">
        {name}
      </span>
    </motion.li>
  );
};

export const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-64 lg:w-52 py-3 h-screen bg-dark flex flex-col justify-between shadow-xl"
    >
      <div>
        {/* Logo and Phone */}
        <div className="relative flex flex-col justify-center px-5 mb-6">
          <img
            src={logo}
            alt="Deluxconex-logo"
            className="cursor-pointer w-40 lg:w-32"
            onClick={() => navigate("/")}
          />
          <a
            href="tel:+18558785233"
            className="text-white text-lg lg:text-xl font-bold hover:text-blue-400 mt-2"
          >
            (855) 878-5233
          </a>
        </div>

        {/* Navigation items */}
        <ul className="p-1 space-y-1">
          <Item name="Buy" Icon={FaHandshake} path="/shop" />
          <CategoryItem name="Rent" Icon={TfiReload} categoryName="rent" />
          <CategoryItem
            name="Cold storage"
            Icon={BiHealth}
            categoryName="cold storage"
          />
          <Item name="Parts" Icon={FaGears} path="/shop" />
          <CategoryItem
            name="Customizations"
            Icon={FaHammer}
            categoryName="parts"
          />
          <CategoryItem
            name="Chasis & trailers"
            Icon={FaTrailer}
            categoryName="parts"
          />
          <Item name="Gallery" Icon={GrGallery} path="/gallery" />
          <Item name="Delivery" Icon={FaTruck} path="/delivery" />
          <Item name="Inventory" Icon={FaMapLocationDot} path="/inventory" />
          <Item name="Contact us" Icon={FaEnvelopeOpen} path="/contact" />
          <Item name="Cart" Icon={FaShoppingCart} path="/auth" />
          <Item name="My account" Icon={FiLogIn} path="/auth" />
          <Item name="Search" Icon={IoSearch} path="/shop" />
        </ul>
      </div>

      {/* Bottom navigation items */}
      <div className="px-5 pb-4">
        <a href="/feedback" className="text-gray-400 text-xs hover:text-white">
          Your feedback matters
        </a>
      </div>
    </motion.div>
  );
};

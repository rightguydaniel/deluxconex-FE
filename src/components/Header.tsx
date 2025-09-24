import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/images/Deluxconex.png";
import { MdOutlineShoppingCart, MdMenu, MdCall } from "react-icons/md";
import { motion } from "framer-motion";
import { useMediaQuery } from "react-responsive";

interface HeaderProps {
  onMenuClick?: () => void;
}

export const Header = ({ onMenuClick }: HeaderProps) => {
  const navigate = useNavigate();
  const isDesktop = useMediaQuery({ minWidth: 1024 });

  const navItems = [
    { name: "Buy", to: "/shop" },
    { name: "Rent", to: `/shop/${encodeURIComponent("rent")}` },
    {
      name: "Cold storage",
      to: `/shop/${encodeURIComponent("cold storage")}`,
    },
    { name: "Parts", to: `/shop/${encodeURIComponent("parts")}` },
    {
      name: "Customizations",
      to: `/shop/${encodeURIComponent("parts")}`,
    },
    {
      name: "Chasis & trailers",
      to: `/shop/${encodeURIComponent("parts")}`,
    },
    { name: "Gallery", to: "/gallery" },
    { name: "Delivery", to: "/delivery" },
    { name: "Inventory", to: "/inventory" },
  ];

  // Desktop Header
  if (isDesktop) {
    return (
      <div className="bg-dark px-8 flex items-center justify-between text-white text-lg font-extralight">
        <img
          src={logo}
          alt="Deluxconex"
          className="pt-2 w-16 h-16 cursor-pointer"
          onClick={() => navigate("/")}
        />
        <ul className="flex">
          {navItems.map((item, index) => (
            <motion.li
              key={index}
              whileHover={{ backgroundColor: "#4B5563" }}
              whileTap={{ scale: 0.95 }}
              className="hover:cursor-pointer py-1 px-3 rounded"
            >
              <Link to={item.to} className="block">
                {item.name}
              </Link>
            </motion.li>
          ))}
        </ul>
        <div className="flex space-x-10">
          <motion.a
            href="tel:+17869529946"
            whileHover={{ scale: 1.05 }}
            className="text-light font-bold hover:underline"
          >
            (786) 952-9946
          </motion.a>
          <motion.div
            whileHover={{
              scale: 1.1,
              backgroundColor: "rgba(255,255,255,0.1)",
            }}
            whileTap={{ scale: 0.9 }}
            className="border border-white rounded p-2 cursor-pointer"
            onClick={() => navigate("/dashboard/cart")}
          >
            <MdOutlineShoppingCart className="h-6 w-6" />
          </motion.div>
        </div>
      </div>
    );
  }

  // Mobile Header
  return (
    <header className="bg-dark px-4 py-3 flex items-center justify-between text-white shadow-md sticky top-0 z-50 w-full">
      {/* Mobile Menu Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="p-1"
        onClick={onMenuClick}
        aria-label="Menu"
      >
        <MdMenu size={24} />
      </motion.button>

      {/* Logo (Centered) */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="mx-auto"
      >
        <img
          src={logo}
          alt="Deluxconex"
          className="w-10 h-10 cursor-pointer"
          onClick={() => navigate("/")}
        />
      </motion.div>

      {/* Right Side Items */}
      <div className="flex items-center space-x-4">
        {/* Call icon */}
        <motion.a
          href="tel:+87437484343"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-1"
          aria-label="Call"
        >
          <MdCall size={20} />
        </motion.a>

        {/* Shopping Cart */}
        <motion.div
          whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.1)" }}
          whileTap={{ scale: 0.9 }}
          className="border border-white rounded p-1 cursor-pointer"
          onClick={() => navigate("/cart")}
        >
          <MdOutlineShoppingCart size={18} />
        </motion.div>
      </div>
    </header>
  );
};

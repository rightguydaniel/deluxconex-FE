import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMenu,
  FiX,
  FiHome,
  FiBox,
  FiUsers,
  FiFileText,
  FiDollarSign,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";

interface SidebarItem {
  name: string;
  icon: React.ReactNode;
  path: string;
}

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const currentPath = window.location.pathname;

  const sidebarItems: SidebarItem[] = [
    { name: "Dashboard", icon: <FiHome />, path: "/admin" },
    { name: "Products", icon: <FiBox />, path: "/admin/products" },
    { name: "Users", icon: <FiUsers />, path: "/admin/users" },
    { name: "Orders", icon: <FiFileText />, path: "/admin/orders" },
    { name: "Invoices", icon: <FiDollarSign />, path: "/admin/invoices" },
    { name: "Payment Requests", icon: <FiDollarSign />, path: "/admin/payment-requests" },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate("/auth");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar toggle */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-lg"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed md:relative z-40 w-64 h-full bg-white shadow-lg"
          >
            <div className="p-4 h-full flex flex-col">
              <div className="mb-8 p-4">
                <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
              </div>
              
              <nav className="flex-1">
                <ul className="space-y-2">
                  {sidebarItems.map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.path}
                        className={`flex items-center p-3 rounded-lg transition-colors ${currentPath === item.path ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100 text-gray-700'}`}
                      >
                        <span className="mr-3">{item.icon}</span>
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="mt-auto space-y-2 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  className={`w-full flex items-center p-3 rounded-lg transition-colors ${currentPath === '/admin/settings' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100 text-gray-700'}`}
                  onClick={() => navigate('/admin/settings')}
                >
                  <span className="mr-3">
                    <FiSettings />
                  </span>
                  <span>Settings</span>
                </button>
                <button
                  type="button"
                  className="w-full flex items-center p-3 rounded-lg transition-colors hover:bg-gray-100 text-gray-700"
                  onClick={handleLogout}
                >
                  <span className="mr-3">
                    <FiLogOut />
                  </span>
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;

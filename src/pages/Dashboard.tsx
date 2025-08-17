import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Contact } from "../components/Homepage/Contact";
import { Footer } from "../components/Homepage/Footer";
import { View } from "../components/dashboard/View";
import AddressBook from "../components/dashboard/AddressBook";
import PaymentMethods from "./PaymentMethods";
import Edit from "../components/dashboard/Edit";
import Orders from "../components/dashboard/Orders";
import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";
import CartPage from "../components/dashboard/CartPage";
import InvoicesPage from "../components/dashboard/InvoicePage";

export const Dashboard = () => {
  const { tab } = useParams<{ tab?: string }>();
  const [activeTab, setActiveTab] = useState(tab || "view");

  useEffect(() => {
    if (tab) {
      setActiveTab(tab);
    }
  }, [tab]);

  const handleChangeTab = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Mobile Header - Only shown on small screens */}
      <div className="md:hidden">
        <Header />
      </div>

      {/* Sidebar - Hidden on mobile, shown on medium screens and up */}
      <div className="hidden md:block sticky top-0 h-screen overflow-y-auto">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex justify-center">
          <div className="w-full md:w-3/5 mt-8 md:mt-16 mb-8">
            <div className="flex flex-wrap justify-center gap-1 md:gap-0">
              <button
                className={`${
                  activeTab === "view"
                    ? "border-x border-t rounded-t-lg text-gray-500"
                    : "border-b text-blue-500"
                } p-2 md:p-4 border-gray-500 text-sm md:text-base`}
                onClick={() => handleChangeTab("view")}
              >
                View
              </button>
              <button
                className={`${
                  activeTab === "cart"
                    ? "border-x border-t rounded-t-lg text-gray-500"
                    : "border-b text-blue-500"
                } p-2 md:p-4 border-gray-500 text-sm md:text-base`}
                onClick={() => handleChangeTab("cart")}
              >
                Cart
              </button>
              <button
                className={`${
                  activeTab === "orders"
                    ? "border-x border-t rounded-t-lg text-gray-500"
                    : "border-b text-blue-500"
                } p-2 md:p-4 border-gray-500 text-sm md:text-base`}
                onClick={() => handleChangeTab("orders")}
              >
                Orders
              </button>
              <button
                className={`${
                  activeTab === "invoices"
                    ? "border-x border-t rounded-t-lg text-gray-500"
                    : "border-b text-blue-500"
                } p-2 md:p-4 border-gray-500 text-sm md:text-base`}
                onClick={() => handleChangeTab("invoices")}
              >
                Invoices
              </button>
              <button
                className={`${
                  activeTab === "address"
                    ? "border-x border-t rounded-t-lg text-gray-500"
                    : "border-b text-blue-500"
                } p-2 md:p-4 border-gray-500 text-sm md:text-base`}
                onClick={() => handleChangeTab("address")}
              >
                Address
              </button>
              <button
                className={`${
                  activeTab === "payment"
                    ? "border-x border-t rounded-t-lg text-gray-500"
                    : "border-b text-blue-500"
                } p-2 md:p-4 border-gray-500 text-sm md:text-base`}
                onClick={() => handleChangeTab("payment")}
              >
                Payment
              </button>
              <button
                className={`${
                  activeTab === "edits"
                    ? "border-x border-t rounded-t-lg text-gray-500"
                    : "border-b text-blue-500"
                } p-2 md:p-4 border-gray-500 text-sm md:text-base`}
                onClick={() => handleChangeTab("edits")}
              >
                Profile
              </button>
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="w-full px-4 md:px-8 mt-2 mb-8">
            {activeTab === "view" ? (
              <View
                handleOrderClick={() => handleChangeTab("orders")}
                handleInvoiceClick={() => handleChangeTab("invoices")}
              />
            ) : activeTab === "address" ? (
              <AddressBook />
            ) : activeTab === "payment" ? (
              <PaymentMethods />
            ) : activeTab === "edits" ? (
              <Edit />
            ) : activeTab === "orders" ? (
              <Orders />
            ) : activeTab === "invoices" ? (
              <InvoicesPage />
            ) : (
              <CartPage />
            )}
          </div>
        </div>
        <Contact />
        <Footer />
      </div>
    </div>
  );
};
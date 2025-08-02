import { useState } from "react";
import { Contact } from "../components/Homepage/Contact";
import { Footer } from "../components/Homepage/Footer";
import { View } from "../components/dashboard/View";
import { AddressBook } from "../components/dashboard/AddressBook";
import { PaymentMethods } from "./PaymentMethods";
import { Edit } from "../components/dashboard/Edit";
import { Orders } from "../components/dashboard/Orders";
import { Feedback } from "../components/dashboard/Feedback";
import { Sidebar } from "../components/Sidebar";

export const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("view");
  const handleChangeTab = (tab: string) => {
    setActiveTab(tab);
  };
  return (
    <div className="flex min-h-screen">
      <div className="sticky top-0 h-screen overflow-y-auto">
        <Sidebar />
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="flex justify-center">
          <div className="w-3/5 mt-16 mb-8">
            <button
              className={`${
                activeTab === "view"
                  ? "border-x border-t rounded-t-lg text-gray-500"
                  : "border-b text-blue-500"
              } p-4 border-gray-500`}
              onClick={() => handleChangeTab("view")}
            >
              View
            </button>
            <button
              className={`${
                activeTab === "address"
                  ? "border-x border-t rounded-t-lg text-gray-500"
                  : "border-b text-blue-500"
              } p-4 border-gray-500`}
              onClick={() => handleChangeTab("address")}
            >
              Address book
            </button>
            <button
              className={`${
                activeTab === "payment"
                  ? "border-x border-t rounded-t-lg text-gray-500"
                  : "border-b text-blue-500"
              } p-4 border-gray-500`}
              onClick={() => handleChangeTab("payment")}
            >
              Payment methods
            </button>
            <button
              className={`${
                activeTab === "edits"
                  ? "border-x border-t rounded-t-lg text-gray-500"
                  : "border-b text-blue-500"
              } p-4 border-gray-500`}
              onClick={() => handleChangeTab("edits")}
            >
              Edits
            </button>
            <button
              className={`${
                activeTab === "orders"
                  ? "border-x border-t rounded-t-lg text-gray-500"
                  : "border-b text-blue-500"
              } p-4 border-gray-500`}
              onClick={() => handleChangeTab("orders")}
            >
              Oders
            </button>
            <button
              className={`${
                activeTab === "feedbacks"
                  ? "border-x border-t rounded-t-lg text-gray-500"
                  : "border-b text-blue-500"
              } p-4 border-gray-500`}
              onClick={() => handleChangeTab("feedbacks")}
            >
              Feedbacks
            </button>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="w-full mt-2 mb-8 px-8">
            {activeTab === "view" ? (
              <View handleOrderClick={()=>handleChangeTab('orders')} />
            ) : activeTab === "address" ? (
              <AddressBook />
            ) : activeTab === "payment" ? (
              <PaymentMethods />
            ) : activeTab === "edits" ? (
              <Edit />
            ) : activeTab === "orders" ? (
              <Orders />
            ) : (
              <Feedback />
            )}
          </div>
        </div>
        <Contact />
        <Footer />
      </div>
    </div>
  );
};

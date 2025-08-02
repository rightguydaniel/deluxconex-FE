import { useState } from "react";
import { Contact } from "../components/Homepage/Contact";
import { Footer } from "../components/Homepage/Footer";
import { Sidebar } from "../components/Sidebar";

interface InputProps {
  title: string;
  type: string;
}

export const Input = ({ title, type }: InputProps) => {
  return (
    <div className="mb-4">
      <label htmlFor="" className="block mb-2 text-xl font-extralight">
        {title}
      </label>
      <input
        type={type}
        className="w-full border border-gray-300 p-4 font-semibold text-xl rounded"
      />
    </div>
  );
};

export const Auth = () => {
  const [activeTab, setActiveTab] = useState("login");
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
                activeTab === "login"
                  ? "border-x border-t rounded-t-lg text-gray-500"
                  : "border-b text-blue-500"
              } p-4 border-gray-500`}
              onClick={() => handleChangeTab("login")}
            >
              Log in
            </button>
            <button
              className={`${
                activeTab === "register"
                  ? "border-x border-t rounded-t-lg text-gray-500"
                  : "border-b text-blue-500"
              } p-4 border-gray-500`}
              onClick={() => handleChangeTab("register")}
            >
              Create new account
            </button>
            <button
              className={`${
                activeTab === "password"
                  ? "border-x border-t rounded-t-lg text-gray-500"
                  : "border-b text-blue-500"
              } p-4 border-gray-500`}
              onClick={() => handleChangeTab("password")}
            >
              Reset your password
            </button>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="w-3/5 mt-2 mb-8 px-8">
            {activeTab === "login" ? (
              <div className="w-full">
                <form action="">
                  <Input title={"Username"} type="text" />
                  <Input title={"Password"} type="password" />
                  <button
                    type="submit"
                    className="w-full bg-light text-dark text-xl font-extrabold py-4 px-8 rounded-lg hover:bg-light/90 transition"
                  >
                    Log in
                  </button>
                </form>
              </div>
            ) : activeTab === "register" ? (
              <div className="w-full">
                <form action="">
                  <Input title={"Email ddress"} type="email" />
                  <Input title={"Username"} type="text" />
                  <Input title={"Contact phone"} type="text" />
                  <Input title={"Password"} type="password" />
                  <button
                    type="submit"
                    className="w-full bg-light text-dark text-xl font-extrabold py-4 px-8 rounded-lg hover:bg-light/90 transition"
                  >
                    Create a new account
                  </button>
                </form>
              </div>
            ) : (
              <div className="w-full">
                <form action="">
                  <Input title={"Username or mail ddress"} type="text" />
                  <p className="font-extralight mb-4">
                    Password reset instructions will be sent to your registered
                    email address.
                  </p>
                  <button
                    type="submit"
                    className="w-full bg-light text-dark text-lg font-extrabold py-4 px-8 rounded-lg hover:bg-light/90 transition"
                  >
                    Create a new account
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
        <Contact />
        <Footer />
      </div>
    </div>
  );
};

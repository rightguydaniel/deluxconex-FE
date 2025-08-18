import { useState } from "react";
import axios from "axios";
import { Contact } from "../components/Homepage/Contact";
import { Footer } from "../components/Homepage/Footer";
import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";
import { useNavigate } from "react-router-dom";

interface InputProps {
  title: string;
  type: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Input = ({ title, type, name, value, onChange }: InputProps) => {
  return (
    <div className="mb-4">
      <label htmlFor="" className="block mb-2 text-xl font-extralight">
        {title}
      </label>
      <input
        type={type}
        value={value}
        name={name}
        onChange={onChange}
        className="w-full border border-gray-300 p-4 font-semibold text-xl rounded"
      />
    </div>
  );
};

export const Auth = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [formData, setFormData] = useState({
    email: "",
    user_name: "",
    full_name: "",
    phone: "",
    password: "",
    newPassword: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const handleChangeTab = (tab: string) => {
    setActiveTab(tab);
    setMessage("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    try {
      let response;
      const API_URL = import.meta.env.VITE_APP_API_URL;

      if (activeTab === "login") {
        response = await axios.post(`${API_URL}/user/login`, {
          email: formData.email,
          password: formData.password,
        });
        // Handle successful login (store token, redirect, etc.)
        localStorage.setItem("token", response.data.token);
        setMessage("Login successful!");
        response.data.data.user.role === "admin"
          ? navigate("/admin")
          : navigate("/dashboard");
      } else if (activeTab === "register") {
        response = await axios.post(`${API_URL}/user/register`, {
          full_name: formData.full_name,
          user_name: formData.user_name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        });
        setMessage("Registration successful! Please log in.");
        setActiveTab("login");
      } else if (activeTab === "password") {
        response = await axios.post(`${API_URL}/user/password/reset-request`, {
          email: formData.email,
        });
        setMessage("Password reset instructions sent to your email.");
      }

      console.log(response?.data);
    } catch (error: any) {
      setMessage(error.response?.data?.message || "An error occurred");
      console.error("Auth error:", error.message);
    }
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
            <div className="flex justify-center">
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
        </div>
        <div className="flex justify-center">
          <div className="w-full md:w-3/5 mt-2 mb-8 px-4 md:px-8">
            {message && (
              <div className="mb-4 p-4 bg-blue-100 text-blue-700 rounded">
                {message}
              </div>
            )}
            {activeTab === "login" ? (
              <div className="w-full">
                <form onSubmit={handleSubmit}>
                  <Input
                    title="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                  <Input
                    title="Password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
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
                <form onSubmit={handleSubmit}>
                  <Input
                    title="Full Name"
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                  />
                  <Input
                    title="Username"
                    type="text"
                    name="user_name"
                    value={formData.user_name}
                    onChange={handleInputChange}
                  />
                  <Input
                    title="Email Address"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                  <Input
                    title="Contact Phone"
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                  <Input
                    title="Password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
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
                <form onSubmit={handleSubmit}>
                  <Input
                    title="Email Address"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                  <p className="font-extralight mb-4">
                    Password reset instructions will be sent to your registered
                    email address.
                  </p>
                  <button
                    type="submit"
                    className="w-full bg-light text-dark text-lg font-extrabold py-4 px-8 rounded-lg hover:bg-light/90 transition"
                  >
                    Reset password
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

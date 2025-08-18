import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Footer } from "../components/Homepage/Footer";
import { Header } from "../components/Header";
import { Input } from "./auth";

export const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [isValidToken, setIsValidToken] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Verify token on component mount
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const API_URL = import.meta.env.VITE_APP_API_URL;
        const response = await axios.get(
          `${API_URL}/user/password/verify-token/${token}`
        );
        console.log(response.data);
        if (response.data.status === "success") {
          setIsValidToken(true);
        } else {
          setMessage("Failed to verify you");
        }
      } catch (error: any) {
        setMessage(error.response?.data?.message || "Invalid or expired token");
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      verifyToken();
    } else {
      setMessage("No token provided");
      setIsLoading(false);
    }
  }, [token]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage("Passwords don't match");
      return;
    }

    try {
      const API_URL = import.meta.env.VITE_APP_API_URL;
      await axios.post(`${API_URL}/user/password/reset`, {
        token,
        newPassword: formData.newPassword,
      });

      setMessage("Password reset successfully! Redirecting to login...");
      setTimeout(() => navigate("/auth"), 3000);
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Error resetting password");
      console.error("Reset password error:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p>Verifying token...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!isValidToken) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="max-w-md w-full p-8 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">Password Reset</h2>
            <p className="text-red-500 mb-4">{message}</p>
            <button
              onClick={() => navigate("/login")}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
            >
              Back to Login
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-md w-full p-8 bg-white rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Reset Your Password</h2>
          {message && (
            <p
              className={`mb-4 ${
                message.includes("successfully")
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {message}
            </p>
          )}
          <form onSubmit={handleSubmit}>
            <Input
              title="New Password"
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
            />
            <Input
              title="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
              disabled={!formData.newPassword || !formData.confirmPassword}
            >
              Reset Password
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

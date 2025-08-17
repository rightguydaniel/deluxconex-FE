import { useState, useEffect } from "react";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiLock,
  FiEdit2,
  FiSave,
  FiX,
} from "react-icons/fi";

const Edit = () => {
  const [user, setUser] = useState({
    full_name: "",
    user_name: "",
    email: "",
    phone: "",
    password: "",
    role: "user",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [tempPassword, setTempPassword] = useState("");

  // Load user data (replace with actual API call)
  useEffect(() => {
    // Mock data
    setUser({
      full_name: "John Doe",
      user_name: "johndoe",
      email: "john@example.com",
      phone: "+1234567890",
      password: "", // Password shouldn't be stored in state in a real app
      role: "user",
    });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSave = () => {
    // Here you would make an API call to update the user
    console.log("Saving user:", user);
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
        {isEditing ? (
          <div className="flex space-x-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded flex items-center"
            >
              <FiX className="mr-1" /> Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-3 py-1 bg-blue-600 text-white rounded flex items-center"
            >
              <FiSave className="mr-1" /> Save
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="px-3 py-1 bg-blue-600 text-white rounded flex items-center"
          >
            <FiEdit2 className="mr-1" /> Edit
          </button>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center">
          <FiUser className="text-gray-500 mr-3" />
          <div className="flex-1">
            <label className="block text-sm text-gray-500">Full Name</label>
            {isEditing ? (
              <input
                type="text"
                name="full_name"
                value={user.full_name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            ) : (
              <p className="text-gray-800">{user.full_name}</p>
            )}
          </div>
        </div>

        <div className="flex items-center">
          <FiUser className="text-gray-500 mr-3" />
          <div className="flex-1">
            <label className="block text-sm text-gray-500">Username</label>
            {isEditing ? (
              <input
                type="text"
                name="user_name"
                value={user.user_name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            ) : (
              <p className="text-gray-800">@{user.user_name}</p>
            )}
          </div>
        </div>

        <div className="flex items-center">
          <FiMail className="text-gray-500 mr-3" />
          <div className="flex-1">
            <label className="block text-sm text-gray-500">Email</label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={user.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            ) : (
              <p className="text-gray-800">{user.email}</p>
            )}
          </div>
        </div>

        <div className="flex items-center">
          <FiPhone className="text-gray-500 mr-3" />
          <div className="flex-1">
            <label className="block text-sm text-gray-500">Phone</label>
            {isEditing ? (
              <input
                type="tel"
                name="phone"
                value={user.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            ) : (
              <p className="text-gray-800">{user.phone}</p>
            )}
          </div>
        </div>

        {isEditing && (
          <div className="flex items-center">
            <FiLock className="text-gray-500 mr-3" />
            <div className="flex-1">
              <label className="block text-sm text-gray-500">
                Change Password
              </label>
              <input
                type="password"
                value={tempPassword}
                onChange={(e) => setTempPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-gray-200 mt-4">
          <p className="text-sm text-gray-500">Account Status</p>
          <div className="flex items-center mt-1">
            <div
              className={`h-2 w-2 rounded-full mr-2 ${
                user.role === "admin" ? "bg-purple-500" : "bg-green-500"
              }`}
            ></div>
            <p className="text-gray-800">
              {user.role === "admin" ? "Administrator" : "Standard User"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Edit;

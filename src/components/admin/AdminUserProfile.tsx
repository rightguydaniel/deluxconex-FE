import { useState } from 'react';
import { FiUser, FiMail, FiPhone, FiLock, FiSave, FiX, FiShield, FiTrash2 } from 'react-icons/fi';

interface AdminUserProfileProps {
  user: {
    id: string;
    full_name: string;
    user_name: string;
    email: string;
    phone: string;
    role: 'user' | 'admin';
    blocked_at: string | null;
    deleted_at: string | null;
  };
  onBlockUser: (userId: string) => void;
  onDeleteUser: (userId: string) => void;
  onRoleChange: (userId: string, role: 'user' | 'admin') => void;
}

const AdminUserProfile = ({ user, onBlockUser, onDeleteUser, onRoleChange }: AdminUserProfileProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);
  const [tempPassword, setTempPassword] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedUser({ ...editedUser, [name]: value });
  };

  const handleSave = () => {
    // Here you would make an API call to update the user
    console.log('Saving user:', editedUser);
    setIsEditing(false);
    // In a real app, you would update the parent state or make an API call
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-900">User Profile</h2>
        <div className="flex space-x-2">
          {isEditing ? (
            <>
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
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-3 py-1 bg-blue-600 text-white rounded flex items-center"
            >
              Edit Profile
            </button>
          )}
        </div>
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
                value={editedUser.full_name}
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
                value={editedUser.user_name}
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
                value={editedUser.email}
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
                value={editedUser.phone}
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
              <label className="block text-sm text-gray-500">Reset Password</label>
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
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Account Role</p>
              {isEditing ? (
                <select
                  value={editedUser.role}
                  onChange={(e) => {
                    const newRole = e.target.value as 'user' | 'admin';
                    setEditedUser({ ...editedUser, role: newRole });
                    onRoleChange(user.id, newRole);
                  }}
                  className="mt-1 px-3 py-2 border border-gray-300 rounded"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              ) : (
                <p className="text-gray-800 capitalize">{user.role}</p>
              )}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => onBlockUser(user.id)}
                className={`px-3 py-1 rounded flex items-center ${
                  user.blocked_at 
                    ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                    : 'bg-red-100 text-red-800 hover:bg-red-200'
                }`}
              >
                {user.blocked_at ? 'Unblock User' : 'Block User'}
              </button>
              <button
                onClick={() => onDeleteUser(user.id)}
                className={`px-3 py-1 rounded flex items-center ${
                  user.deleted_at 
                    ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {user.deleted_at ? 'Restore User' : 'Delete User'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserProfile;
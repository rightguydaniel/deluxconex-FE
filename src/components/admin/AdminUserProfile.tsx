import { useEffect, useMemo, useState } from 'react';
import type { ChangeEvent } from 'react';
import { FiUser, FiMail, FiPhone, FiLock, FiSave, FiX } from 'react-icons/fi';
import api from '../../services/api';

interface AdminUser {
  id: string;
  full_name: string;
  user_name: string;
  email: string;
  phone: string;
  role: 'user' | 'admin';
  blocked_at: string | null;
  deleted_at: string | null;
  createdAt: string;
}

interface AdminUserProfileProps {
  user: AdminUser;
  onBlockUser: (userId: string, blocked?: boolean) => Promise<void>;
  onDeleteUser: (userId: string, deleted?: boolean) => Promise<void>;
  onRoleChange: (userId: string, role: 'user' | 'admin') => Promise<void>;
  onUserUpdated: (user: AdminUser) => void;
}

const getErrorMessage = (error: unknown): string => {
  if (error && typeof error === 'object' && 'response' in error) {
    const err = error as { response?: { data?: { message?: string; errorMessage?: string } } };
    return (
      err.response?.data?.message ||
      err.response?.data?.errorMessage ||
      'An unexpected error occurred'
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred';
};

const AdminUserProfile = ({
  user,
  onBlockUser,
  onDeleteUser,
  onRoleChange,
  onUserUpdated,
}: AdminUserProfileProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);
  const [tempPassword, setTempPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [statusLoading, setStatusLoading] = useState<'block' | 'delete' | null>(null);
  const [roleUpdating, setRoleUpdating] = useState(false);

  useEffect(() => {
    setEditedUser(user);
  }, [user]);

  useEffect(() => {
    setTempPassword('');
    setIsEditing(false);
    setAlert(null);
  }, [user.id]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setEditedUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setAlert(null);

    try {
      const payload: Partial<AdminUser> & { password?: string } = {
        full_name: editedUser.full_name,
        user_name: editedUser.user_name,
        email: editedUser.email,
        phone: editedUser.phone,
      };

      if (tempPassword.trim().length > 0) {
        payload.password = tempPassword;
      }

      const response = await api.put(`/admin/users/${user.id}`, payload);
      const updated: AdminUser = {
        ...(response.data?.data ?? editedUser),
        createdAt: response.data?.data?.createdAt ?? user.createdAt,
      };

      onUserUpdated(updated);
      setEditedUser(updated);
      setTempPassword('');
      setIsEditing(false);
      setAlert({ type: 'success', message: 'Profile updated successfully.' });
    } catch (error) {
      setAlert({ type: 'error', message: getErrorMessage(error) });
    } finally {
      setIsSaving(false);
    }
  };

  const toggleBlockUser = async () => {
    setStatusLoading('block');
    setAlert(null);
    try {
      await onBlockUser(user.id, !user.blocked_at);
      setAlert({
        type: 'success',
        message: user.blocked_at ? 'User unblocked successfully.' : 'User blocked successfully.',
      });
    } catch (error) {
      setAlert({ type: 'error', message: getErrorMessage(error) });
    } finally {
      setStatusLoading(null);
    }
  };

  const toggleDeleteUser = async () => {
    setStatusLoading('delete');
    setAlert(null);
    try {
      await onDeleteUser(user.id, !user.deleted_at);
      setAlert({
        type: 'success',
        message: user.deleted_at ? 'User restored successfully.' : 'User archived successfully.',
      });
    } catch (error) {
      setAlert({ type: 'error', message: getErrorMessage(error) });
    } finally {
      setStatusLoading(null);
    }
  };

  const handleRoleSelect = async (event: ChangeEvent<HTMLSelectElement>) => {
    const newRole = event.target.value as 'user' | 'admin';
    if (newRole === user.role) {
      setEditedUser((prev) => ({ ...prev, role: newRole }));
      return;
    }

    setRoleUpdating(true);
    setAlert(null);
    try {
      await onRoleChange(user.id, newRole);
      setEditedUser((prev) => ({ ...prev, role: newRole }));
      setAlert({ type: 'success', message: 'Role updated successfully.' });
    } catch (error) {
      setAlert({ type: 'error', message: getErrorMessage(error) });
    } finally {
      setRoleUpdating(false);
    }
  };

  const isToggling = useMemo(() => statusLoading !== null, [statusLoading]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-900">User Profile</h2>
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditedUser(user);
                  setTempPassword('');
                  setAlert(null);
                }}
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded flex items-center"
                disabled={isSaving}
              >
                <FiX className="mr-1" /> Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-3 py-1 bg-blue-600 text-white rounded flex items-center disabled:opacity-70"
                disabled={isSaving}
              >
                <FiSave className="mr-1" />
                {isSaving ? 'Saving...' : 'Save'}
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

      {alert && (
        <div
          className={`rounded-md px-4 py-2 text-sm ${
            alert.type === 'success'
              ? 'bg-green-50 text-green-700'
              : 'bg-red-50 text-red-700'
          }`}
        >
          {alert.message}
        </div>
      )}

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
                onChange={(event) => setTempPassword(event.target.value)}
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
                  onChange={handleRoleSelect}
                  className="mt-1 px-3 py-2 border border-gray-300 rounded"
                  disabled={roleUpdating}
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
                onClick={toggleBlockUser}
                className={`px-3 py-1 rounded flex items-center disabled:opacity-70 ${
                  user.blocked_at
                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                    : 'bg-red-100 text-red-800 hover:bg-red-200'
                }`}
                disabled={isToggling}
              >
                {statusLoading === 'block'
                  ? 'Updating...'
                  : user.blocked_at
                  ? 'Unblock User'
                  : 'Block User'}
              </button>
              <button
                onClick={toggleDeleteUser}
                className={`px-3 py-1 rounded flex items-center disabled:opacity-70 ${
                  user.deleted_at
                    ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
                disabled={isToggling}
              >
                {statusLoading === 'delete'
                  ? 'Updating...'
                  : user.deleted_at
                  ? 'Restore User'
                  : 'Delete User'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserProfile;

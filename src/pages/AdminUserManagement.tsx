import { useState, useEffect, useCallback } from "react";
import {
  FiUsers,
  FiChevronDown,
  FiChevronRight,
  FiSearch,
} from "react-icons/fi";
import AdminUserProfile from "../components/admin/AdminUserProfile";
import AdminUserOrders from "../components/admin/AdminUserOrders";
import AdminLayout from "./AdminLayout";
import AdminUserPaymentMethods from "../components/admin/AdminUserPaymentMethods";
import AdminUserAddresses from "../components/admin/AdminUserAddresses";
import AdminUserCart from "../components/admin/AdminUserCart";
import AdminUserInvoices from "../components/admin/AdminUserInvoices";
import api from "../services/api";

interface User {
  id: string;
  full_name: string;
  user_name: string;
  email: string;
  phone: string;
  role: "user" | "admin";
  blocked_at: string | null;
  deleted_at: string | null;
  createdAt: string;
}

const AdminUserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("profile");
  const [expandedUsers, setExpandedUsers] = useState<Record<string, boolean>>(
    {}
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const syncSelectedUser = useCallback((list: User[]) => {
    setSelectedUser((prev) => {
      if (!prev) {
        return null;
      }
      const updated = list.find((user) => user.id === prev.id);
      return updated ?? null;
    });

    setExpandedUsers((prev) => {
      const validIds = new Set(list.map((user) => user.id));
      const next: Record<string, boolean> = {};
      Object.entries(prev).forEach(([id, value]) => {
        if (validIds.has(id)) {
          next[id] = value;
        }
      });
      return next;
    });
  }, []);

  const fetchUsers = useCallback(
    async (term: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const params = term.trim()
          ? {
              search: term.trim(),
            }
          : undefined;
        const response = await api.get("/admin/users", { params });
        const fetchedUsers: User[] = response.data?.data ?? [];
        setUsers(fetchedUsers);
        syncSelectedUser(fetchedUsers);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Unable to fetch users";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    },
    [syncSelectedUser]
  );

  useEffect(() => {
    fetchUsers("");
  }, [fetchUsers]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchUsers(searchTerm);
    }, 300);

    return () => clearTimeout(timeout);
  }, [fetchUsers, searchTerm]);

  const toggleUserExpansion = (userId: string) => {
    setExpandedUsers((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  const handleUserSync = useCallback((updatedUser: User) => {
    setUsers((prev) =>
      prev.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    );

    setSelectedUser((prev) =>
      prev && prev.id === updatedUser.id ? updatedUser : prev
    );
  }, []);

  const handleBlockUser = useCallback(
    async (userId: string, shouldBlock?: boolean) => {
      const targetUser = users.find((user) => user.id === userId);
      if (!targetUser) {
        return;
      }

      const desiredState =
        typeof shouldBlock === "boolean"
          ? shouldBlock
          : targetUser.blocked_at === null;

      const response = await api.patch(`/admin/users/${userId}/block`, {
        blocked: desiredState,
      });

      const updated = {
        ...targetUser,
        blocked_at: response.data?.data?.blocked_at ?? null,
      };

      handleUserSync(updated);
    },
    [handleUserSync, users]
  );

  const handleDeleteUser = useCallback(
    async (userId: string, shouldDelete?: boolean) => {
      const targetUser = users.find((user) => user.id === userId);
      if (!targetUser) {
        return;
      }

      const desiredState =
        typeof shouldDelete === "boolean"
          ? shouldDelete
          : targetUser.deleted_at === null;

      const response = await api.patch(`/admin/users/${userId}/delete`, {
        deleted: desiredState,
      });

      const updated = {
        ...targetUser,
        deleted_at: response.data?.data?.deleted_at ?? null,
      };

      handleUserSync(updated);
    },
    [handleUserSync, users]
  );

  const handleRoleChange = useCallback(
    async (userId: string, newRole: "user" | "admin") => {
      const targetUser = users.find((user) => user.id === userId);
      if (!targetUser || targetUser.role === newRole) {
        return;
      }

      await api.patch(`/admin/users/${userId}/role`, { role: newRole });
      const updated = { ...targetUser, role: newRole };
      handleUserSync(updated);
    },
    [handleUserSync, users]
  );

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center mb-6">
          <FiUsers className="text-gray-600 mr-2" />
          <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search users by name, email, or username..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {error ? (
            <div className="p-6 text-center text-red-500">{error}</div>
          ) : isLoading ? (
            <div className="p-6 text-center text-gray-500">Loading users...</div>
          ) : users.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No users found</div>
          ) : (
            <div className="divide-y divide-gray-200">
              {users.map((user) => (
                <div key={user.id} className="p-4">
                  <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => {
                      toggleUserExpansion(user.id);
                      setSelectedUser(user);
                      setActiveTab("profile");
                    }}
                  >
                    <div className="flex items-center">
                      {expandedUsers[user.id] ? (
                        <FiChevronDown className="text-gray-500 mr-2" />
                      ) : (
                        <FiChevronRight className="text-gray-500 mr-2" />
                      )}
                      <div>
                        <p className="font-medium text-gray-900">
                          {user.full_name}
                        </p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {user.role}
                      </span>
                      {user.blocked_at && (
                        <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                          Blocked
                        </span>
                      )}
                      {user.deleted_at && (
                        <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                          Deleted
                        </span>
                      )}
                    </div>
                  </div>

                  {expandedUsers[user.id] && selectedUser?.id === user.id && (
                    <div className="mt-4 pl-8">
                      <div className="flex border-b border-gray-200 mb-4">
                        <button
                          className={`py-2 px-4 font-medium ${
                            activeTab === "profile"
                              ? "text-blue-600 border-b-2 border-blue-600"
                              : "text-gray-500"
                          }`}
                          onClick={() => setActiveTab("profile")}
                        >
                          Profile
                        </button>
                        <button
                          className={`py-2 px-4 font-medium ${
                            activeTab === "orders"
                              ? "text-blue-600 border-b-2 border-blue-600"
                              : "text-gray-500"
                          }`}
                          onClick={() => setActiveTab("orders")}
                        >
                          Orders
                        </button>
                        <button
                          className={`py-2 px-4 font-medium ${
                            activeTab === "payment-methods"
                              ? "text-blue-600 border-b-2 border-blue-600"
                              : "text-gray-500"
                          }`}
                          onClick={() => setActiveTab("payment-methods")}
                        >
                          Payment Methods
                        </button>
                        <button
                          className={`py-2 px-4 font-medium ${
                            activeTab === "addresses"
                              ? "text-blue-600 border-b-2 border-blue-600"
                              : "text-gray-500"
                          }`}
                          onClick={() => setActiveTab("addresses")}
                        >
                          Addresses
                        </button>
                        <button
                          className={`py-2 px-4 font-medium ${
                            activeTab === "cart"
                              ? "text-blue-600 border-b-2 border-blue-600"
                              : "text-gray-500"
                          }`}
                          onClick={() => setActiveTab("cart")}
                        >
                          Cart
                        </button>
                        <button
                          className={`py-2 px-4 font-medium ${
                            activeTab === "invoices"
                              ? "text-blue-600 border-b-2 border-blue-600"
                              : "text-gray-500"
                          }`}
                          onClick={() => setActiveTab("invoices")}
                        >
                          Invoices
                        </button>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                      {activeTab === "profile" && (
                        <AdminUserProfile
                          user={selectedUser}
                          onBlockUser={handleBlockUser}
                          onDeleteUser={handleDeleteUser}
                          onRoleChange={handleRoleChange}
                          onUserUpdated={handleUserSync}
                        />
                      )}
                        {activeTab === "orders" && (
                          <AdminUserOrders userId={selectedUser.id} />
                        )}
                        {activeTab === 'payment-methods' && <AdminUserPaymentMethods userId={selectedUser.id} />}
                        {activeTab === 'addresses' && <AdminUserAddresses userId={selectedUser.id} />}
                        {activeTab === 'cart' && <AdminUserCart userId={selectedUser.id} />}
                        {activeTab === 'invoices' && <AdminUserInvoices userId={selectedUser.id} />}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminUserManagement;

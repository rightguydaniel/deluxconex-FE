import { useState, useEffect } from "react";
import {
  FiUsers,
  // FiPackage,
  FiDollarSign,
  FiBox,
  FiTrendingUp,
  FiActivity,
  FiShoppingCart,
} from "react-icons/fi";
import AdminLayout from "./AdminLayout";
import api from "../services/api";

interface StatsCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  color: string;
}

const StatsCard = ({ title, value, change, icon, color }: StatsCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 flex flex-col">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${color} text-white`}>{icon}</div>
      </div>
      <div className="mt-4">
        <span
          className={`text-sm font-medium ${
            change >= 0 ? "text-green-600" : "text-red-600"
          }`}
        >
          {change >= 0 ? `+${change}%` : `${change}%`}{" "}
          <span className="text-gray-500">vs last month</span>
        </span>
      </div>
    </div>
  );
};

// interface RecentActivity {
//   id: string;
//   type: "order" | "invoice" | "user" | "product";
//   title: string;
//   description: string;
//   time: string;
//   user?: string;
// }

const AdminDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Stats from API
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    pendingInvoices: 0,
    visitorsToday: 0,
  });

  // const [recentActivities, setRecentActivities] = useState<RecentActivity[]>(
  //   []
  // );
  const [quickStats, setQuickStats] = useState<any>({
    orderCounts: {},
    invoiceCounts: {},
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch stats from backend
        // Note: API base is configured in src/services/api.ts via VITE_APP_API_URL
        const res = await api.get("/admin/dashboard");
        const data = res.data?.data || {};

        setStats({
          totalUsers: data.totalUsers || 0,
          totalOrders: data.totalOrders || 0,
          totalRevenue: data.totalRevenue || 0,
          totalProducts: data.totalProducts || 0,
          pendingInvoices: data.pendingInvoices || 0,
          visitorsToday: data.totalVisitorsToday || 0,
        });

        // Keep recent activities local/mock for now
        // const mockActivities: RecentActivity[] = [
        //   {
        //     id: "act-1",
        //     type: "order",
        //     title: "New Order",
        //     description: "40ft Shipping Container",
        //     time: "10 minutes ago",
        //     user: "Jane Smith",
        //   },
        //   {
        //     id: "act-2",
        //     type: "invoice",
        //     title: "Invoice Paid",
        //     description: "INV-2023-015 for $3,800",
        //     time: "1 hour ago",
        //   },
        // ];

        // setRecentActivities(mockActivities);
        // fetch quick stats
        try {
          const resQS = await api.get("/admin/dashboard/quick-stats");
          const qs = resQS.data?.data || {};
          setQuickStats(qs);
        } catch (err) {
          console.debug(
            "Unable to fetch quick stats",
            err instanceof Error ? err.message : String(err)
          );
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // const getActivityIcon = (type: string) => {
  //   switch (type) {
  //     case "order":
  //       return <FiPackage className="text-blue-500" />;
  //     case "invoice":
  //       return <FiDollarSign className="text-green-500" />;
  //     case "user":
  //       return <FiUsers className="text-purple-500" />;
  //     case "product":
  //       return <FiBox className="text-yellow-500" />;
  //     default:
  //       return <FiActivity className="text-gray-500" />;
  //   }
  // };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Dashboard Overview
          </h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatsCard
            title="Total Users"
            value={stats.totalUsers}
            change={12.5}
            icon={<FiUsers size={20} />}
            color="bg-purple-500"
          />
          <StatsCard
            title="Total Orders"
            value={stats.totalOrders}
            change={8.2}
            icon={<FiShoppingCart size={20} />}
            color="bg-blue-500"
          />
          <StatsCard
            title="Total Revenue"
            value={formatCurrency(stats.totalRevenue)}
            change={18.7}
            icon={<FiDollarSign size={20} />}
            color="bg-green-500"
          />
          <StatsCard
            title="Total Products"
            value={stats.totalProducts}
            change={5.0}
            icon={<FiBox size={20} />}
            color="bg-yellow-500"
          />
          <StatsCard
            title="Visitors Today"
            value={stats.visitorsToday}
            change={0.0}
            icon={<FiActivity size={20} />}
            color="bg-indigo-500"
          />
          <StatsCard
            title="Pending Invoices"
            value={stats.pendingInvoices}
            change={4.1}
            icon={<FiTrendingUp size={20} />}
            color="bg-red-500"
          />
        </div>

        {/* Recent Activities */}
        {/* <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Recent Activities
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-1">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900">
                        {activity.title}
                      </h3>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {activity.description}
                    </p>
                    {activity.user && (
                      <p className="text-xs text-gray-400 mt-2">
                        By {activity.user}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="px-6 py-4 border-t border-gray-200 text-center">
            <button className="text-sm font-medium text-blue-600 hover:text-blue-800">
              View all activities
            </button>
          </div>
        </div> */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Order Status
            </h2>
            <div className="space-y-4">
              {quickStats?.orderCounts &&
              Object.keys(quickStats.orderCounts).length > 0 ? (
                Object.entries(quickStats.orderCounts).map(
                  ([status, count]) => {
                    const totalOrders =
                      Object.values(quickStats.orderCounts).reduce(
                        (a: number, b: any) => a + Number(b),
                        0
                      ) || 1;
                    const pct = Math.round((Number(count) / totalOrders) * 100);
                    const color =
                      status === "processing"
                        ? "bg-blue-600"
                        : status === "pending"
                        ? "bg-yellow-500"
                        : status === "confirmed"
                        ? "bg-purple-600"
                        : status === "shipped"
                        ? "bg-indigo-600"
                        : status === "delivered"
                        ? "bg-green-600"
                        : status === "cancelled"
                        ? "bg-red-600"
                        : "bg-gray-600";
                    return (
                      <div key={status}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-500">
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </span>
                          <span className="font-medium">{String(count)}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`${color} h-2 rounded-full`}
                            style={{ width: `${pct}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  }
                )
              ) : (
                <>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-500">Processing</span>
                      <span className="font-medium">24</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: "60%" }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-500">Shipped</span>
                      <span className="font-medium">18</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full"
                        style={{ width: "45%" }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-500">Delivered</span>
                      <span className="font-medium">12</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: "30%" }}
                      ></div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Invoice Status
            </h2>
            <div className="space-y-4">
              {quickStats?.invoiceCounts &&
              Object.keys(quickStats.invoiceCounts).length > 0 ? (
                Object.entries(quickStats.invoiceCounts).map(
                  ([status, count]) => {
                    const totalInv =
                      Object.values(quickStats.invoiceCounts).reduce(
                        (a: number, b: any) => a + Number(b),
                        0
                      ) || 1;
                    const pct = Math.round((Number(count) / totalInv) * 100);
                    const color =
                      status === "paid"
                        ? "bg-green-600"
                        : status === "sent"
                        ? "bg-yellow-600"
                        : status === "overdue"
                        ? "bg-red-600"
                        : status === "draft"
                        ? "bg-gray-400"
                        : status === "cancelled"
                        ? "bg-red-400"
                        : "bg-gray-600";
                    return (
                      <div key={status}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-500">
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </span>
                          <span className="font-medium">{String(count)}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`${color} h-2 rounded-full`}
                            style={{ width: `${pct}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  }
                )
              ) : (
                // fallback hardcoded
                <>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-500">Paid</span>
                      <span className="font-medium">32</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: "64%" }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-500">Pending</span>
                      <span className="font-medium">12</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-600 h-2 rounded-full"
                        style={{ width: "24%" }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-500">Overdue</span>
                      <span className="font-medium">6</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-red-600 h-2 rounded-full"
                        style={{ width: "12%" }}
                      ></div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;

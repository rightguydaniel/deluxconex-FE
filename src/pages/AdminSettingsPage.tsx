import AdminLayout from "./AdminLayout";

const AdminSettingsPage = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
          <p className="text-gray-500">Configure admin preferences and defaults.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <section className="bg-white rounded-lg shadow p-6 space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Profile</h2>
              <p className="text-sm text-gray-500">
                Update your contact information and notification settings.
              </p>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Display Name</label>
                <input
                  type="text"
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Jane Doe"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="admin@example.com"
                  disabled
                />
              </div>
              <button
                type="button"
                className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700"
                disabled
              >
                Save Changes
              </button>
            </div>
          </section>

          <section className="bg-white rounded-lg shadow p-6 space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">System Preferences</h2>
              <p className="text-sm text-gray-500">
                Placeholder controls for themes, security, and integrations.
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Enable dark mode</span>
                <input type="checkbox" className="h-4 w-4" disabled />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Require 2FA for admins</span>
                <input type="checkbox" className="h-4 w-4" disabled />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Receive weekly reports</span>
                <input type="checkbox" className="h-4 w-4" disabled />
              </div>
            </div>
          </section>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettingsPage;

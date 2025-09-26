import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HomepageWithVisit } from "./pages/Homepage";
import { Auth } from "./pages/auth";
import { Dashboard } from "./pages/Dashboard";
import { Shop } from "./pages/Shop";
import { Gallery } from "./pages/Gallery";
import { Inventory } from "./pages/Inventory";
import { Delivery } from "./pages/Delivery";
import { Product } from "./pages/product";
import AdminProductsPage from "./pages/AdminProductPage";
import AdminOrdersPage from "./pages/AdminOrderPage";
import AdminInvoicesPage from "./pages/AdminInvoicesPage";
import AdminUserManagement from "./pages/AdminUserManagement";
import AdminDashboard from "./pages/AdminDashboard";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import CheckoutCancel from "./pages/CheckoutCancel";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" index element={<HomepageWithVisit />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard/:tab?" element={<Dashboard />} />
        <Route path="/shop/:category?" element={<Shop />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/delivery" element={<Delivery />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/products" element={<AdminProductsPage />} />
        <Route path="/admin/orders" element={<AdminOrdersPage />} />
        <Route path="/admin/invoices" element={<AdminInvoicesPage />} />
        <Route path="/admin/users" element={<AdminUserManagement />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/checkout/success" element={<CheckoutSuccess />} />
        <Route path="/checkout/cancel" element={<CheckoutCancel />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

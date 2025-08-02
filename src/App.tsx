import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Homepage } from "./pages/Homepage";
import { Auth } from "./pages/auth";
import { Dashboard } from "./pages/Dashboard";
import { Shop } from "./pages/Shop";
import { Gallery } from "./pages/Gallery";
import { Inventory } from "./pages/Inventory";
import { Delivery } from "./pages/Delivery";
import { Product } from "./pages/product";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" index element={<Homepage />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/delivery" element={<Delivery />} />
        <Route path="/product" element={<Product />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import { Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Drops from "./pages/Drops";          
import DropDetail from "./pages/DropDetail";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Admin from "./pages/Admin";
import Success from "./pages/Success";
import LookbookStories from "./pages/Shoots";
import CartProvider from "./context/CartContext";
import NavBar from "./components/NavBar";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <CartProvider>
        <NavBar />
        <ToastContainer theme="dark" position="top-right" autoClose={3000} />
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/drops" element={<Drops />} />
          <Route path="/drops/:slug" element={<DropDetail />} />

          <Route path="/shop" element={<Navigate to="/drops" replace />} />

          <Route path="/product/:id" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/success" element={<Success />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/lookbook" element={<LookbookStories />} />

          <Route path="*" element={<div className="container-fluid section text-center">404 - Page Not Found</div>} />
        </Routes>
      </CartProvider>
    </div>
  );
}

export default App;
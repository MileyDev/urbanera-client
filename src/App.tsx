import Home from './pages/Home'
import CartProvider from './context/CartContext'
import Shop from './pages/Shop'
import NavBar from './components/NavBar'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Admin from './pages/Admin'
import Success from './pages/Success'
import './index.css'
import { Route, Routes } from 'react-router-dom'

function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
    <CartProvider>
            <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/success" element={<Success />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<div className="container-fluid full-screen-section text-center">404 - Page Not Found</div>} />
      </Routes>
    </CartProvider>
    </div>
  )
}

export default App

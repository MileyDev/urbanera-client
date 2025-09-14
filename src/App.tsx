import Home from './pages/Home'
import { CartProvider } from './context/CartContext'
import Shop from './pages/Shop'
import NavBar from './components/NavBar'
import Product from './pages/Product'
import Cart from './pages/Cart'
import './App.css'
import { Route, Routes } from 'react-router-dom'

function App() {
  return (
    <CartProvider>
            <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </CartProvider>

  )
}

export default App

import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { type Product } from '../types/Product';
import { toast } from 'react-toastify';

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  const handleViewDetails = () => {
    console.log('Navigating to product:', product.id);
    navigate(`/product/${product.id}`);
  };

  const handleAddToCart = () => {
    addToCart({ ...product, quantity: 1 });
    toast.success(`${product.name} added to cart!`, {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: 'dark',
    });
  };

  return (
    <div className="card h-100 shadow-sm" style={{ background: '#1a1a1a' }}>
      <img
        src={product.imageUrl}
        className="card-img-top"
        alt={product.name}
        style={{ height: '250px', objectFit: 'cover', width: '100%' }}
        onError={(e) => {
          e.currentTarget.src = 'https://via.placeholder.com/250';
          console.error(`Failed to load image: ${product.imageUrl}`);
        }}
      />
      <div className="card-body d-flex flex-column" style={{ color: 'var(--white)' }}>
        <h5 className="card-title">{product.name}</h5>
        <p className="card-text text-muted flex-grow-1">{product.description}</p>
        <p className="card-text fw-bold">₦{product.price.toLocaleString()}</p>
        <div className="mt-auto d-flex gap-2">
          <button
            className="btn btn-dark"
            style={{ borderColor: 'var(--dark-gold)' }}
            onClick={handleViewDetails}
          >
            View Details
          </button>
          <button
            className="btn btn-outline-danger"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
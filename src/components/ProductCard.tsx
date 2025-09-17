import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
}

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  const handleViewDetails = () => {
    console.log('Navigating to product:', product.id);
    navigate(`/product/${product.id}`);
  };

  return (
    <div className="card h-100 shadow-sm">
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
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{product.name}</h5>
        <p className="card-text text-muted flex-grow-1">{product.description}</p>
        <p className="card-text fw-bold">${product.price}</p>
        <div className="mt-auto d-flex gap-2">
          <button
            className="btn btn-dark"
            onClick={handleViewDetails}
          >
            View Details
          </button>
          <button
            className="btn btn-outline-dark"
            onClick={() => addToCart(product)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
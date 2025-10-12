import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { type Product } from '../types/Product';
import { toast } from 'react-toastify';
import { FaStar } from 'react-icons/fa';
import axios from 'axios';

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [averageRating, setAverageRating] = useState<string>('No reviews');

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`https://urbanera-api-37beaa1d3e9b.herokuapp.com/api/reviews/${product.id}`);
        const reviews = response.data;
        if (reviews.length) {
          const avg = (reviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / reviews.length).toFixed(1);
          setAverageRating(avg);
        }
      } catch (err) {
        console.error('Fetch reviews error:', err);
      }
    };
    fetchReviews();
  }, [product.id]);

  const handleViewDetails = () => {
    console.log('Navigating to product:', product.id);
    navigate(`/product/${product.id}`);
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Please select a size!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark',
      });
      return;
    }
    addToCart({ ...product, quantity: 1, selectedSize });
    toast.success(`${product.name} (Size: ${selectedSize}) added to cart!`, {
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
        <p className="card-text text-muted mb-2">{product.description}</p>
        <p className="card-text mb-2">
          <FaStar color="lemon" /> {averageRating} ({product.reviews?.length || 0} reviews)
        </p>
        <p className="card-text fw-bold" style={{ color: 'black'}}>₦{product.price.toLocaleString()}</p>
        <div className="mb-3">
          <label htmlFor={`size-${product.id}`} className="form-label" style={{ color: 'var(--white)' }}>
            Size
          </label>
          <select
            id={`size-${product.id}`}
            className="form-select"
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
            style={{ backgroundColor: '#1C2526', color: 'var(--white)', borderColor: 'var(--dark-gold)' }}
          >
            <option value="">Select a size</option>
            {product.sizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-auto d-flex gap-2">
          <button
            className="btn btn-dark"
            style={{ borderColor: 'var(--dark-gold)', color: 'var(--dark-gold)' }}
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
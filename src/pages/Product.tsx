import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { type Product } from '../types/Product';

export default function Product() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    if (!id || isNaN(parseInt(id, 10))) {
      setError('Invalid product ID');
      setLoading(false);
      return;
    }

    console.log('Fetching product with ID:', id);
    axios
      .get(`https://urbanera-api-37beaa1d3e9b.herokuapp.com/api/products/${id}`)
      .then((res) => {
        console.log('Product response:', res.data);
        setProduct(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        setError(err.response?.status === 404 ? 'Product not found' : `Failed to load product: ${err.message}`);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="container-fluid full-screen-section text-center">Loading...</div>;
  if (error) return <div className="container-fluid full-screen-section text-center text-danger">{error}</div>;
  if (!product) return <div className="container-fluid full-screen-section text-center">Product not found</div>;

  return (
    <div className="container-fluid full-screen-section">
      <div className="row">
        <h1 className="mb-4" style={{ fontWeight: 700 }}>Product Details</h1>
        <div className="col-md-6">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="img-fluid rounded"
            style={{ maxHeight: '400px', objectFit: 'cover', width: '100%', border: '2px solid var(--dark-gold)' }}
            onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/400')}
          />
        </div>
        <div className="col-md-6 d-flex flex-column justify-content-center">
          <h1 className="mb-3">{product.name}</h1>
          <p className="text-muted mb-3">{product.description}</p>
          <p className="fs-4 fw-bold mb-4">₦{product.price.toLocaleString()}</p>
          <button
            className="btn btn-dark btn-lg"
            onClick={() => addToCart({ ...product, quantity: 1 })}
          >
            Add to Cart <i className="bi bi-cart"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
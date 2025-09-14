import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';

interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
}

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

    console.log('Fetching product with ID:', id); // Debug
    axios
      .get(`http://localhost:5025/api/products/${id}`)
      .then((res) => {
        console.log('Product response:', res.data); // Debug
        setProduct(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        setError(err.response?.status === 404 ? 'Product not found' : `Failed to load product: ${err.message}`);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="container text-center py-5">Loading...</div>;
  if (error) return <div className="container text-center py-5 text-danger">{error}</div>;
  if (!product) return <div className="container text-center py-5">Product not found</div>;

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-md-6">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="img-fluid rounded"
            style={{ maxHeight: '400px', objectFit: 'cover' }}
            onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/400')}
          />
        </div>
        <div className="col-md-6">
          <h1 className="mb-3">{product.name}</h1>
          <p className="text-muted mb-3">{product.description}</p>
          <p className="fs-4 fw-bold mb-4">${product.price}</p>
          <button
            className="btn btn-dark btn-lg"
            onClick={() => addToCart(product)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
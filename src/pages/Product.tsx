import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { type Product, type Review } from '../types/Product';
import { toast } from 'react-toastify';
import { FaStar } from 'react-icons/fa';

export default function Product() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    if (!id || isNaN(parseInt(id, 10))) {
      setError('Invalid product ID');
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        const [productResponse, reviewsResponse] = await Promise.all([
          axios.get(`https://urbanera-api-37beaa1d3e9b.herokuapp.com/api/products/${id}`),
          axios.get(`https://urbanera-api-37beaa1d3e9b.herokuapp.com/api/reviews/${id}`)
        ]);
        setProduct({ ...productResponse.data, reviews: reviewsResponse.data });
        setLoading(false);
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Failed to load product or reviews.');
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    if (!selectedSize) {
      toast.error('Please select a size!', { theme: 'dark' });
      return;
    }
    addToCart({ ...product, quantity: 1, selectedSize });
    toast.success(`${product.name} (Size: ${selectedSize}) added to cart!`, { theme: 'dark' });
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      toast.error('Please enter a username!', { theme: 'dark' });
      return;
    }
    if (!rating || rating < 1 || rating > 5) {
      toast.error('Please select a rating between 1 and 5!', { theme: 'dark' });
      return;
    }
    try {
      await axios.post('https://urbanera-api-37beaa1d3e9b.herokuapp.com/api/reviews', {
        productId: product?.id,
        username,
        rating,
        comment
      });
      toast.success('Review submitted!', { theme: 'dark' });
      setUsername('');
      setRating(0);
      setComment('');
      const reviewsResponse = await axios.get(`https://urbanera-api-37beaa1d3e9b.herokuapp.com/api/reviews/${id}`);
      setProduct((prev) => prev ? { ...prev, reviews: reviewsResponse.data } : null);
    } catch (err) {
      toast.error('Failed to submit review.', { theme: 'dark' });
    }
  };

  if (loading) return <div className="container-fluid full-screen-section text-center">Loading...</div>;
  if (error) return <div className="container-fluid full-screen-section text-center text-danger">{error}</div>;
  if (!product) return <div className="container-fluid full-screen-section text-center">Product not found</div>;

  const averageRating = product.reviews?.length
    ? (product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length).toFixed(1)
    : 'No reviews';

  return (
    <div className="container-fluid full-screen-section">
      <div className="row">
        <h1 className="mb-4" style={{ fontWeight: 700, color: 'var(--dark-gold)' }}>Product Details</h1>
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
          <h1 className="mb-3" style={{ color: 'var(--white)' }}>{product.name}</h1>
          <p className="text-muted mb-3">{product.description}</p>
          <p className="fs-5 mb-3" style={{ color: 'var(--white)' }}>
            <FaStar color="#B8860B" /> {averageRating} ({product.reviews?.length || 0} reviews)
          </p>
          <p className="fs-4 fw-bold mb-4" style={{ color: 'var(--white)' }}>₦{product.price.toLocaleString()}</p>
          <div className="mb-3">
            <label htmlFor="size-select" className="form-label" style={{ color: 'var(--white)' }}>
              Size
            </label>
            <select
              id="size-select"
              className="form-select"
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              style={{ backgroundColor: '#1C2526', color: 'var(--white)', borderColor: 'var(--dark-gold)' }}
            >
              <option value="">Select a size</option>
              {product.sizes.map((size) => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
          <button
            className="btn btn-dark btn-lg"
            style={{ borderColor: 'var(--dark-gold)', color: 'var(--dark-gold)' }}
            onClick={handleAddToCart}
          >
            Add to Cart <i className="bi bi-cart"></i>
          </button>
        </div>
      </div>
      <div className="mt-5">
        <h2 style={{ color: 'var(--dark-gold)' }}>Leave a Review</h2>
        <form onSubmit={handleSubmitReview}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label" style={{ color: 'var(--white)' }}>Username</label>
            <input
              type="text"
              id="username"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your username"
              style={{ backgroundColor: '#1C2526', color: 'var(--white)', borderColor: 'var(--dark-gold)' }}
            />
          </div>
          <div className="mb-3">
            <label className="form-label" style={{ color: 'var(--white)' }}>Rating</label>
            <div className="d-flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  size={24}
                  color={star <= rating ? '#B8860B' : '#6c757d'}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setRating(star)}
                />
              ))}
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="comment" className="form-label" style={{ color: 'var(--white)' }}>Comment</label>
            <textarea
              id="comment"
              className="form-control"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Your review"
              style={{ backgroundColor: '#1C2526', color: 'var(--white)', borderColor: 'var(--dark-gold)' }}
            />
          </div>
          <button
            className="btn btn-dark"
            style={{ borderColor: 'var(--dark-gold)', color: 'var(--dark-gold)' }}
            type="submit"
          >
            Submit Review
          </button>
        </form>
      </div>
      <div className="mt-5">
        <h2 style={{ color: 'var(--dark-gold)' }}>Reviews</h2>
        {product.reviews?.length ? (
          product.reviews.map((review: Review) => (
            <div key={review.id} className="mb-3 p-3 border rounded" style={{ background: '#1C2526', color: 'var(--white)' }}>
              <p className="mb-1">
                <FaStar color="#B8860B" /> {review.rating} / 5
              </p>
              <p className="mb-1">{review.comment}</p>
              <p className="mb-1" style={{ color: 'gray', fontSize: 'small'}}>
                Posted by {review.user?.username || 'Anonymous'} on {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))
        ) : (
          <p className="text-muted">No reviews yet.</p>
        )}
      </div>
    </div>
  );
}
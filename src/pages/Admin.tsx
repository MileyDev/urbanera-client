import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { type Product, type Review } from '../types/Product';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Admin() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: 0,
    imageUrl: '',
    sizes: '' as string,
  });
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'products' | 'reviews'>('products');

  useEffect(() => {
    if (token) {
      const fetchData = async () => {
        try {
          const [productsResponse, reviewsResponse] = await Promise.all([
            axios.get('https://urbanera-api-37beaa1d3e9b.herokuapp.com/api/products', {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get('https://urbanera-api-37beaa1d3e9b.herokuapp.com/api/reviews', {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);
          setProducts(productsResponse.data);
          setReviews(reviewsResponse.data);
        } catch (err) {
          setError('Failed to load data.');
          console.error('Fetch error:', err);
        }
      };
      fetchData();
    }
  }, [token]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://urbanera-api-37beaa1d3e9b.herokuapp.com/api/auth/login', {
        username,
        password,
      });
      const { token } = response.data;
      localStorage.setItem('token', token);
      setToken(token);
      setUsername('');
      setPassword('');
      setError(null);
      toast.success('Logged in successfully!', { theme: 'dark' });
    } catch (err) {
      setError('Invalid username or password.');
      toast.error('Invalid username or password.', { theme: 'dark' });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setProducts([]);
    setReviews([]);
    setError(null);
    toast.info('Logged out.', { theme: 'dark' });
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const product = {
        ...newProduct,
        price: Number(newProduct.price),
        sizes: newProduct.sizes.split(',').map((s) => s.trim()),
      };
      await axios.post('https://urbanera-api-37beaa1d3e9b.herokuapp.com/api/products', product, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Product added!', { theme: 'dark' });
      setNewProduct({ name: '', description: '', price: 0, imageUrl: '', sizes: '' });
      const response = await axios.get('https://urbanera-api-37beaa1d3e9b.herokuapp.com/api/products', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(response.data);
    } catch (err) {
      toast.error('Failed to add product.', { theme: 'dark' });
      setError('Failed to add product.');
    }
  };

  const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editProduct) return;
    try {
      const product = {
        ...editProduct,
        price: Number(editProduct.price),
        sizes: editProduct.sizes,
      };
      await axios.put(`https://urbanera-api-37beaa1d3e9b.herokuapp.com/api/products/${editProduct.id}`, product, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Product updated!', { theme: 'dark' });
      setEditProduct(null);
      const response = await axios.get('https://urbanera-api-37beaa1d3e9b.herokuapp.com/api/products', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(response.data);
    } catch (err) {
      toast.error('Failed to update product.', { theme: 'dark' });
      setError('Failed to update product.');
    }
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      await axios.delete(`https://urbanera-api-37beaa1d3e9b.herokuapp.com/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Product deleted!', { theme: 'dark' });
      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      toast.error('Failed to delete product.', { theme: 'dark' });
      setError('Failed to delete product.');
    }
  };

  const handleDeleteReview = async (id: number) => {
    try {
      await axios.delete(`https://urbanera-api-37beaa1d3e9b.herokuapp.com/api/reviews/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Review deleted!', { theme: 'dark' });
      setReviews(reviews.filter(r => r.id !== id));
    } catch (err) {
      toast.error('Failed to delete review.', { theme: 'dark' });
      setError('Failed to delete review.');
    }
  };

  if (!token) {
    return (
      <div className="container-fluid full-screen-section">
        <h1 className="mb-4" style={{ fontWeight: 700, color: 'var(--dark-gold)' }}>Admin Login</h1>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleLogin} className="row justify-content-center">
          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="username" className="form-label" style={{ color: 'var(--white)' }}>
                Username
              </label>
              <input
                type="text"
                className="form-control"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={{ backgroundColor: '#1C2526', color: 'var(--white)', borderColor: 'var(--dark-gold)' }}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label" style={{ color: 'var(--white)' }}>
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ backgroundColor: '#1C2526', color: 'var(--white)', borderColor: 'var(--dark-gold)' }}
              />
            </div>
            <button
              type="submit"
              className="btn btn-dark w-100"
              style={{ borderColor: 'var(--dark-gold)', color: 'var(--dark-gold)' }}
            >
              Login
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="container-fluid full-screen-section">
      <h1 className="mb-4" style={{ fontWeight: 700, color: 'var(--dark-gold)' }}>Admin Dashboard</h1>
      <div className="text-end mb-4">
        <button
          className="btn btn-outline-danger"
          style={{ borderColor: 'var(--dark-gold)', color: 'var(--dark-gold)' }}
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
      {error && <div className="alert alert-danger mb-3">{error}</div>}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
            style={{ color: activeTab === 'products' ? '#B8860B' : '#FFFFFF', background: '#1C2526' }}
          >
            Products
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
            style={{ color: activeTab === 'reviews' ? '#B8860B' : '#FFFFFF', background: '#1C2526' }}
          >
            Reviews
          </button>
        </li>
      </ul>
      {activeTab === 'products' ? (
        <>
          <h2 style={{ color: 'var(--dark-gold)' }}>Add Product</h2>
          <form onSubmit={handleAddProduct} className="mb-4">
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="name" className="form-label" style={{ color: 'var(--white)' }}>Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  required
                  style={{ backgroundColor: '#1C2526', color: 'var(--white)', borderColor: 'var(--dark-gold)' }}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="price" className="form-label" style={{ color: 'var(--white)' }}>Price (₦)</label>
                <input
                  type="number"
                  className="form-control"
                  id="price"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                  required
                  style={{ backgroundColor: '#1C2526', color: 'var(--white)', borderColor: 'var(--dark-gold)' }}
                />
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label" style={{ color: 'var(--white)' }}>Description</label>
              <textarea
                className="form-control"
                id="description"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                required
                style={{ backgroundColor: '#1C2526', color: 'var(--white)', borderColor: 'var(--dark-gold)' }}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="imageUrl" className="form-label" style={{ color: 'var(--white)' }}>Image URL</label>
              <input
                type="text"
                className="form-control"
                id="imageUrl"
                value={newProduct.imageUrl}
                onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                required
                style={{ backgroundColor: '#1C2526', color: 'var(--white)', borderColor: 'var(--dark-gold)' }}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="sizes" className="form-label" style={{ color: 'var(--white)' }}>Sizes (comma-separated)</label>
              <input
                type="text"
                className="form-control"
                id="sizes"
                value={newProduct.sizes}
                onChange={(e) => setNewProduct({ ...newProduct, sizes: e.target.value })}
                placeholder="S,M,L"
                required
                style={{ backgroundColor: '#1C2526', color: 'var(--white)', borderColor: 'var(--dark-gold)' }}
              />
            </div>
            <button
              type="submit"
              className="btn btn-dark"
              style={{ borderColor: 'var(--dark-gold)', color: 'var(--dark-gold)' }}
            >
              Add Product
            </button>
          </form>

          {editProduct && (
            <div className="mt-5">
              <h2 style={{ color: 'var(--dark-gold)' }}>Edit Product</h2>
              <form onSubmit={handleEditProduct}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="editName" className="form-label" style={{ color: 'var(--white)' }}>Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="editName"
                      value={editProduct.name}
                      onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                      required
                      style={{ backgroundColor: '#1C2526', color: 'var(--white)', borderColor: 'var(--dark-gold)' }}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="editPrice" className="form-label" style={{ color: 'var(--white)' }}>Price (₦)</label>
                    <input
                      type="number"
                      className="form-control"
                      id="editPrice"
                      value={editProduct.price}
                      onChange={(e) => setEditProduct({ ...editProduct, price: Number(e.target.value) })}
                      required
                      style={{ backgroundColor: '#1C2526', color: 'var(--white)', borderColor: 'var(--dark-gold)' }}
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="editDescription" className="form-label" style={{ color: 'var(--white)' }}>Description</label>
                  <textarea
                    className="form-control"
                    id="editDescription"
                    value={editProduct.description}
                    onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })}
                    required
                    style={{ backgroundColor: '#1C2526', color: 'var(--white)', borderColor: 'var(--dark-gold)' }}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="editImageUrl" className="form-label" style={{ color: 'var(--white)' }}>Image URL</label>
                  <input
                    type="text"
                    className="form-control"
                    id="editImageUrl"
                    value={editProduct.imageUrl}
                    onChange={(e) => setEditProduct({ ...editProduct, imageUrl: e.target.value })}
                    required
                    style={{ backgroundColor: '#1C2526', color: 'var(--white)', borderColor: 'var(--dark-gold)' }}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="editSizes" className="form-label" style={{ color: 'var(--white)' }}>Sizes (comma-separated)</label>
                  <input
                    type="text"
                    className="form-control"
                    id="editSizes"
                    value={editProduct.sizes.join(',')}
                    onChange={(e) => setEditProduct({ ...editProduct, sizes: e.target.value.split(',').map((s) => s.trim()) })}
                    required
                    style={{ backgroundColor: '#1C2526', color: 'var(--white)', borderColor: 'var(--dark-gold)' }}
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-dark me-2"
                  style={{ borderColor: 'var(--dark-gold)', color: 'var(--dark-gold)' }}
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  className="btn btn-dark"
                  onClick={() => setEditProduct(null)}
                  style={{ borderColor: 'var(--dark-gold)', color: 'var(--dark-gold)' }}
                >
                  Cancel
                </button>
              </form>
            </div>
          )}

          <h2 style={{ color: 'var(--dark-gold)' }}>Products</h2>
          <div className="row g-4">
            {products.map(product => (
              <div key={product.id} className="col-md-4">
                <div className="card h-100 shadow-sm" style={{ background: '#1a1a1a', color: 'var(--white)' }}>
                  <img
                    src={product.imageUrl}
                    className="card-img-top"
                    alt={product.name}
                    style={{ height: '200px', objectFit: 'cover' }}
                    onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/200')}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{product.name}</h5>
                    <p className="card-text">{product.description}</p>
                    <p className="card-text fw-bold">₦{product.price.toLocaleString()}</p>
                    <p className="card-text">Sizes: {product.sizes.join(', ')}</p>
                    <button
                      className="btn btn-dark me-2"
                      style={{ borderColor: 'var(--dark-gold)', color: 'var(--dark-gold)' }}
                      onClick={() => setEditProduct(product)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <h2 style={{ color: 'var(--dark-gold)' }}>Reviews</h2>
          {reviews.length ? (
            <div className="row g-4">
              {reviews.map(review => (
                <div key={review.id} className="col-md-4">
                  <div className="card h-100 shadow-sm" style={{ background: '#1a1a1a', color: 'var(--white)' }}>
                    <div className="card-body">
                      <p>Product ID: {review.productId}</p>
                      <p>Rating: {review.rating} / 5</p>
                      <p>{review.comment}</p>
                      <p>Posted by: {review.user?.username || 'Anonymous'}</p>
                      <p className="text-muted small">Posted on {new Date(review.createdAt).toLocaleDateString()}</p>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDeleteReview(review.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted">No reviews yet.</p>
          )}
        </>
      )}
    </div>
  );
}
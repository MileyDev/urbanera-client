import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  sizes: string[];
}

const Admin: React.FC = () => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: 0,
    imageUrl: '',
    sizes: '',
  });
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      fetchProducts();
    }
  }, [token]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('https://urbanera-api-37beaa1d3e9b.herokuapp.com/api/products', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Products fetched:', response.data);
      setProducts(response.data);
    } catch (err: any) {
      console.error('Fetch products error:', err);
      setError('Failed to fetch products.');
    }
  };

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
      console.log('Login successful:', token);
    } catch (err: any) {
      console.error('Login error:', err);
      setError('Invalid username or password.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setProducts([]);
    setError(null);
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
      setNewProduct({ name: '', description: '', price: 0, imageUrl: '', sizes: '' });
      fetchProducts();
      console.log('Product added:', product);
    } catch (err: any) {
      console.error('Add product error:', err);
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
      setEditProduct(null);
      fetchProducts();
      console.log('Product updated:', product);
    } catch (err: any) {
      console.error('Update product error:', err);
      setError('Failed to update product.');
    }
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      await axios.delete(`https://urbanera-api-37beaa1d3e9b.herokuapp.com/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProducts();
      console.log('Product deleted:', id);
    } catch (err: any) {
      console.error('Delete product error:', err);
      setError('Failed to delete product.');
    }
  };

  if (!token) {
    return (
      <div className="container mt-5 mt-md-5 pt-5 px-3">
        <h1 className="display-4 text-center mb-4" style={{ color: '#B8860B' }}>Admin Login</h1>
        <div className="row justify-content-center">
          <div className="col-md-6">
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label htmlFor="username" className="form-label" style={{ color: '#1C2526' }}>
                  Username
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label" style={{ color: '#1C2526' }}>
                  Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-100" style={{ backgroundColor: '#B8860B', borderColor: '#B8860B' }}>
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5 mt-md-5 pt-5 px-3">
      <h1 className="display-4 text-center mb-4" style={{ color: '#B8860B' }}>Admin Dashboard</h1>
      <div className="text-end mb-4">
        <button className="btn btn-outline-secondary" onClick={handleLogout} style={{ color: '#1C2526', borderColor: '#1C2526' }}>
          Logout
        </button>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Add Product Form */}
      <h2 className="h4 mb-3" style={{ color: '#1C2526' }}>Add New Product</h2>
      <form onSubmit={handleAddProduct}>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="name" className="form-label" style={{ color: '#1C2526' }}>Name</label>
            <input
              type="text"
              className="form-control"
              id="name"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="price" className="form-label" style={{ color: '#1C2526' }}>Price (₦)</label>
            <input
              type="number"
              className="form-control"
              id="price"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
              required
            />
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label" style={{ color: '#1C2526' }}>Description</label>
          <textarea
            className="form-control"
            id="description"
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
            required
          ></textarea>
        </div>
        <div className="mb-3">
          <label htmlFor="imageUrl" className="form-label" style={{ color: '#1C2526' }}>Image URL</label>
          <input
            type="text"
            className="form-control"
            id="imageUrl"
            value={newProduct.imageUrl}
            onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="sizes" className="form-label" style={{ color: '#1C2526' }}>Sizes (comma-separated)</label>
          <input
            type="text"
            className="form-control"
            id="sizes"
            value={newProduct.sizes}
            onChange={(e) => setNewProduct({ ...newProduct, sizes: e.target.value })}
            placeholder="S,M,L"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#B8860B', borderColor: '#B8860B' }}>
          Add Product
        </button>
      </form>

      {/* Edit Product Form */}
      {editProduct && (
        <div className="mt-5">
          <h2 className="h4 mb-3" style={{ color: '#1C2526' }}>Edit Product</h2>
          <form onSubmit={handleEditProduct}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="editName" className="form-label" style={{ color: '#1C2526' }}>Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="editName"
                  value={editProduct.name}
                  onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="editPrice" className="form-label" style={{ color: '#1C2526' }}>Price (₦)</label>
                <input
                  type="number"
                  className="form-control"
                  id="editPrice"
                  value={editProduct.price}
                  onChange={(e) => setEditProduct({ ...editProduct, price: Number(e.target.value) })}
                  required
                />
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="editDescription" className="form-label" style={{ color: '#1C2526' }}>Description</label>
              <textarea
                className="form-control"
                id="editDescription"
                value={editProduct.description}
                onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })}
                required
              ></textarea>
            </div>
            <div className="mb-3">
              <label htmlFor="editImageUrl" className="form-label" style={{ color: '#1C2526' }}>Image URL</label>
              <input
                type="text"
                className="form-control"
                id="editImageUrl"
                value={editProduct.imageUrl}
                onChange={(e) => setEditProduct({ ...editProduct, imageUrl: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="editSizes" className="form-label" style={{ color: '#1C2526' }}>Sizes (comma-separated)</label>
              <input
                type="text"
                className="form-control"
                id="editSizes"
                value={editProduct.sizes.join(',')}
                onChange={(e) => setEditProduct({ ...editProduct, sizes: e.target.value.split(',').map((s) => s.trim()) })}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary me-2" style={{ backgroundColor: '#B8860B', borderColor: '#B8860B' }}>
              Save Changes
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setEditProduct(null)}
              style={{ backgroundColor: '#1C2526', borderColor: '#1C2526' }}
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      {/* Product Table */}
      <h2 className="h4 mt-5 mb-3" style={{ color: '#1C2526' }}>Products</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Price (₦)</th>
            <th scope="col">Description</th>
            <th scope="col">Sizes</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.price}</td>
              <td>{product.description}</td>
              <td>{product.sizes.join(', ')}</td>
              <td>
                <button
                  className="btn btn-outline-primary me-2"
                  onClick={() => setEditProduct(product)}
                  style={{ borderColor: '#B8860B', color: '#B8860B' }}
                >
                  Edit
                </button>
                <button
                  className="btn btn-outline-danger"
                  onClick={() => handleDeleteProduct(product.id)}
                  style={{ borderColor: '#1C2526', color: '#1C2526' }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Admin;
import { useState, useEffect } from 'react';
import axios from 'axios';
import { type Product } from '../types/Product';

const API_BASE_URL = 'https://urbanera-api-37beaa1d3e9b.herokuapp.com/api';


export default function Admin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState(0);
  const [newDescription, setNewDescription] = useState('');
  const [newImage, setNewImage] = useState<File | null>(null);
  const [authKey, setAuthKey] = useState('');

  const [updateId, setUpdateId] = useState(0);
  const [updatePrice, setUpdatePrice] = useState(0);

  const [removeId, setRemoveId] = useState(0);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/products`);
      setProducts(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load products.');
      setLoading(false);
    }
  };

  const addProduct = async () => {
    if (!newName || newPrice <= 0 || !newDescription || !newImage) {
      setError('All fields are required for new product.');
      return;
    }

    const formData = new FormData();
    formData.append('name', newName);
    formData.append('price', newPrice.toString());
    formData.append('description', newDescription);
    formData.append('image', newImage);
    formData.append('apiKey', authKey)

    try {
      const response = await axios.post(`${API_BASE_URL}/products`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);
      fetchProducts();
      setNewName('');
      setNewPrice(0);
      setNewDescription('');
      setNewImage(null);
      setAuthKey('');
      setMessage('Product created successfully');
      setError(null);
    } catch (err) {
      setError('Failed to add product.');
    }
  };

  const removeProduct = async () => {
    if (removeId <= 0) {
      setError('Valid ID required for product deletion.');
      return;
    }

    try {
      console.log('Updating price for ID:', updateId, 'Price:', updatePrice, 'AuthKey', authKey); // Debug
      const response = await axios.post(
        `${API_BASE_URL}/products/${removeId}`,
        { apiKey: authKey },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Product removal response:', response.data); // Debug
      fetchProducts();
      setRemoveId(0);
      setError(null);
      setMessage('Product has been successfully removed.');
    } catch (err: any) {
      console.error('Product removal error:', err.response?.data || err.message); // Debug
      setError(`Failed to remove product: ${err.response?.data?.error || err.message}`);
    }
  }

  const updateProductPrice = async () => {
    if (updateId <= 0 || updatePrice <= 0) {
      setError('Valid ID and price are required for update.');
      return;
    }

    try {
      console.log('Updating price for ID:', updateId, 'Price:', updatePrice, 'AuthKey', authKey); // Debug
      const response = await axios.post(
        `${API_BASE_URL}/products/${updateId}/price`,
        { apiKey: authKey, price: updatePrice },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Price update response:', response.data); // Debug
      fetchProducts();
      setUpdateId(0);
      setUpdatePrice(0);
      setError(null);
      setMessage('Product price successfully updated.');
    } catch (err: any) {
      console.error('Price update error:', err.response?.data || err.message); // Debug
      setError(`Failed to update price: ${err.response?.data?.error || err.message}`);
    }
  };

  if (loading) return <div className="container-fluid full-screen-section text-center">Loading...</div>;

  return (
    <div className="container-fluid full-screen-section" style={{ color: 'var(--white)'}}>
      <h1 className="mb-4">Admin Dashboard</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}

      <h2>Current Products</h2>
      <div className="row g-4">
        {products.map(product => (
          <div key={product.id} className="col-md-4">
            <div className="card h-100 shadow-sm">
              <img src={product.imageUrl} className="card-img-top" alt={product.name} />
              <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text">{product.description}</p>
                <p className="card-text fw-bold">₦{product.price.toLocaleString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <h2 className="mt-5">Add New Product</h2>
      <div className="form-group mb-3">
        <label>Name</label>
        <input className="form-control" value={newName} onChange={(e) => setNewName(e.target.value)} />
      </div>
      <div className="form-group mb-3">
        <label>Price (NGN)</label>
        <input className="form-control" type="number" value={newPrice} onChange={(e) => setNewPrice(parseFloat(e.target.value))} />
      </div>
      <div className="form-group mb-3">
        <label>Description</label>
        <input className="form-control" value={newDescription} onChange={(e) => setNewDescription(e.target.value)} />
      </div>
      <div className="form-group mb-3">
        <label>Image</label>
        <input className="form-control" type="file" onChange={(e) => setNewImage(e.target.files?.[0] || null)} />
      </div>
      <div className="form-group mb-3">
        <label>Authentication Key</label>
        <input className="form-control" value={authKey} onChange={(e) => setAuthKey(e.target.value)} />
      </div>
      <button className="btn btn-dark mt-3" onClick={addProduct}>Add Product</button>

      <h2 className="mt-5">Update Product Price</h2>
      <div className="form-group mb-3">
        <label>Product ID</label>
        <input className="form-control" type="number" value={updateId} onChange={(e) => setUpdateId(parseInt(e.target.value))} />
      </div>
      <div className="form-group mb-3">
        <label>New Price (NGN)</label>
        <input className="form-control" type="number" value={updatePrice} onChange={(e) => setUpdatePrice(parseFloat(e.target.value))} />
      </div>
      <div className="form-group mb-3">
        <label>Authentication Key</label>
        <input className="form-control" value={authKey} onChange={(e) => setAuthKey(e.target.value)} />
      </div>      
      <button className="btn btn-dark mt-3" onClick={updateProductPrice}>Update Price</button>

      <h2 className="mt-5">Remove a Product</h2>
      <div className="form-group mb-3">
        <label>Product ID</label>
        <input className="form-control" type="number" value={removeId} onChange={(e) => setRemoveId(parseInt(e.target.value))} />
      </div>
      <div className="form-group mb-3">
        <label>Authentication Key</label>
        <input className="form-control" value={authKey} onChange={(e) => setAuthKey(e.target.value)} />
      </div>
      <button className="btn btn-outline-danger mt-3" onClick={removeProduct}>Remove Product</button>
    </div>
  );
}
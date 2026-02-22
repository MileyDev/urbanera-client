import { useState, useEffect } from 'react';
import axios from 'axios';
import { type Product } from '../types/Product';
import ProductCard from '../components/ProductCard';


export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const url = `https://urbaneraapi.onrender.com/api/products?search=${encodeURIComponent(searchQuery)}`;
        console.log(`Fetching products from: ${url}`);
        const response = await axios.get(url);
        console.log('Products fetched:', response.data);
        setProducts(response.data);
        setLoading(false);
      } catch (err: any) {
        console.error('Fetch error:', err.message, err.response?.data);
        setError('Failed to load products. Please try again.');
        setLoading(false);
      }
    };
    fetchProducts();
  }, [searchQuery]);

  return (
    <div className="container-fluid section section--alt">
      <h1 className="section-title mb-4" style={{ textAlign: "center" }}>
        Drops
      </h1>

      <p className="section-lead" style={{ marginBottom: 24 }}>
        Search by name, category, or drop.
      </p>

      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ maxWidth: 520, margin: "0 auto" }}
        />
      </div>

      {loading && <div className="text-center text-muted">Loading products...</div>}
      {error && <div className="text-center text-danger">{error}</div>}
      {!loading && !error && products.length === 0 && (
        <div className="text-center text-muted">No products found.</div>
      )}

      <div className="row g-4">
        {products.map(product => (
          <div key={product.id} className="col-md-4">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}
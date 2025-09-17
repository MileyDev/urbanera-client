import { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

export default function Shop() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('https://urbanera-api-37beaa1d3e9b.herokuapp.com/api/products')
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Fetch error:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="container-fluid full-screen-section text-center">Loading...</div>;

  return (
    <div className="container-fluid full-screen-section">
      <h1 className="mb-4">Shop UrbanEra</h1>
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
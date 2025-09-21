import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { type Product } from "../types/Product";
import axios from "axios";
import '../Home.css';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch featured products
    axios.get('https://urbanera-api-37beaa1d3e9b.herokuapp.com/api/products')
      .then(res => {
        console.log('Products fetched:', res.data);
        setFeaturedProducts([...res.data.slice(0, 3)]);
        setLoading(false);
      })
      .catch(err => {
        console.error('Fetch error:', err);
        setError('Failed to load featured products.');
        setLoading(false);
      });

    // Scroll animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          console.log('Visible element:', entry.target.className); // Debug
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-slide-in').forEach(el => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div className="container-fluid hero-section">
        <div className="row align-items-center text-center">
          <div className="col-12">
            <h1 className="display-3 fw-bold animate-slide-in" style={{ color: 'var(--dark-gold)', position: 'relative', zIndex: 1 }}>
              UrbanEra: Streetwear Redefined
            </h1>
            <p className="lead animate-slide-in" style={{ color: '#bebbbb', position: 'relative', zIndex: 1 }}>
              Discover bold, premium streetwear crafted for the modern urbanite.
            </p>
            <Link to="/shop" className="btn btn-dark btn-lg mt-3 animate-slide-in" style={{ position: 'relative', zIndex: 1 }}>
              Shop Now
            </Link>
          </div>
        </div>
      </div>

      <div className="container-fluid py-5">
        <h2 className="text-center mb-4 animate-slide-in" style={{ color: 'var(--dark-gold)' }}>Featured Collections</h2>
        {loading && <div className="text-center text-muted">Loading products...</div>}
        {error && <div className="text-center text-danger">{error}</div>}
        {!loading && !error && featuredProducts.length === 0 && (
          <div className="text-center text-muted">No products available.</div>
        )}
        <div className="row g-4" style={{ color: 'var(--white)' }}>
          {featuredProducts.map(product => (
            <div key={product.id} className="col-md-4">
              <div className="card h-100 shadow-sm">
                <img
                  src={product.imageUrl}
                  className="card-img-top"
                  alt={product.name}
                  style={{ height: '250px', objectFit: 'cover' }}
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/250';
                    console.error(`Failed to load image: ${product.imageUrl}`);
                  }}
                />
                <div className="card-body">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text text-muted">{product.description}</p>
                  <p className="card-text fw-bold">₦{product.price.toLocaleString()}</p>
                  <Link to={`/product/${product.id}`} className="btn btn-dark">View Details</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-4">
          <Link to="/shop" className="btn btn-outline-danger animate-slide-in">View All Collections</Link>
        </div>
      </div>

      <div className="container-fluid py-5 about-section">
        <div className="row text-center">
          <div className="col-12">
            <h2 className="mb-4 animate-slide-in" style={{ color: 'var(--dark-gold)' }}>About UrbanEra</h2>
            <p className="lead mx-auto animate-slide-in" style={{ color: '#bebbbb', maxWidth: '600px' }}>
              UrbanEra is where street meets art. Born in the heart of Nigeria’s urban culture, crafted by top craftsmen resulting in premium streetwear that blends bold designs with timeless quality. Join the movement.
            </p>
          </div>
        </div>
      </div>

      <div className="container-fluid py-5 footer-section">
        <div className="row text-center">
          <div className="col-12">
            <h2 className="mb-4 animate-slide-in" style={{ color: 'var(--dark-gold)' }}>Join the Members Club</h2>
            <div className="mx-auto" style={{ maxWidth: '400px' }}>
              <input
                type="email"
                className="form-control mb-3 animate-slide-in"
                placeholder="Enter your email"
              />
              <button className="btn btn-dark btn-lg animate-slide-in">Subscribe</button>
            </div>
            <div className="mt-4" style={{ color: '#bebbbb' }}>
              <a href="https://wa.me/+2349117666722" className="mx-2 text-muted animate-slide-in">
                <i className="bi bi-whatsapp" style={{ fontSize: '1.5rem' }}></i>
              </a>
              <a href="https://instagram.com/theurban_era" className="mx-2 text-muted animate-slide-in">
                <i className="bi bi-instagram" style={{ fontSize: '1.5rem' }}></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
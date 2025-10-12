import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { type Product } from "../types/Product";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '../Home.css';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-slide-in').forEach(el => {
      observer.observe(el);
    });

    console.log('Slider initialized with react-slick');
    return () => observer.disconnect();
  }, []);

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
  };

  return (
    <>
      <div className="container-fluid hero-section">
        <Slider {...sliderSettings}>
          <div className="slide">
            <img
              src="https://res.cloudinary.com/dt67ut3jx/image/upload/f_auto,q_auto/v1758537256/hero_d0sx2y.jpg"
              alt="Hero"
              style={{ width: '100%', height: '100vh', objectFit: 'cover' }}
              onLoad={() => console.log('Hero image loaded')}
              onError={() => console.error('Failed to load hero_d0sx2y.jpg')}
            />
          </div>
          <div className="slide">
            <img
              src="https://res.cloudinary.com/dt67ut3jx/image/upload/f_auto,q_auto/v1758877520/shoot1_r2j69r.jpg"
              alt="Shoot 1"
              style={{ width: '100%', height: '100vh', objectFit: 'cover' }}
              onLoad={() => console.log('Shoot 1 image loaded')}
              onError={() => console.error('Failed to load shoot1_r2j69r.jpg')}
            />
          </div>
          <div className="slide">
            <img
              src="https://res.cloudinary.com/dt67ut3jx/image/upload/f_auto,q_auto/v1758877553/shoot2_px2cag.jpg"
              alt="Shoot 2"
              style={{ width: '100%', height: '100vh', objectFit: 'cover' }}
              onLoad={() => console.log('Shoot 2 image loaded')}
              onError={() => console.error('Failed to load shoot2_px2cag.jpg')}
            />
          </div>
        </Slider>
        <div className="row align-items-center text-center">
          <div className="col-12">
            <h1 className="display-3 fw-bold animate-slide-in" style={{ color: 'var(--dark-gold)', position: 'relative', zIndex: 2, fontWeight: 800 }}>
              UrbanEra: Streetwear Redefined
            </h1>
            <p className="lead animate-slide-in" style={{ color: 'var(--dark-gold)', position: 'relative', zIndex: 2, fontWeight: 900 }}>
              Discover bold, premium streetwear crafted for the modern urbanite.
            </p>
            <Link to="/shop" className="btn btn-dark btn-lg mt-3 animate-slide-in" style={{ position: 'relative', zIndex: 2 }}>
              Shop Now
            </Link>
          </div>
        </div>
      </div>

      <div className="container-fluid py-5">
        <h2 className="text-center mb-4 animate-slide-in" style={{ color: 'var(--black)', fontWeight: 700 }}>Featured Collections</h2>
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
            <h2 className="mb-4 animate-slide-in" style={{ color: 'var(--black)', fontWeight: 700 }}>About UrbanEra</h2>
            <p className="lead mx-auto animate-slide-in" style={{ color: 'black', maxWidth: '600px', fontWeight: 500 }}>
              UrbanEra is where street meets art. Born in the heart of Nigeria’s urban culture, crafted by top craftsmen resulting in premium streetwear that blends bold designs with timeless quality. Join the movement.
            </p>
          </div>
        </div>
      </div>

      <div className="container-fluid py-5 footer-section">
        <div className="row text-center">
          <div className="col-12">
            <h2 className="mb-4 animate-slide-in" style={{ color: 'black', fontWeight: 700 }}>Join our Members Club</h2>
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
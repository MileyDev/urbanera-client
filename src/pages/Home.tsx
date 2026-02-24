import { useEffect } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '../Home.css';
import FeaturedDrops from "../components/FeaturedDrops";
import { Footer, IntroCard } from "../components/Sections";


export default function Home() {
  useEffect(() => {
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
          <div className="col-12 hero-copy">
            <div className="hero-eyebrow animate-slide-in">Lagos roots. Global execution.</div>

            <h1 className="hero-title animate-slide-in">
              UrbanEra <span className="accent">Streetwear</span> Redefined
            </h1>

            <p className="hero-sub animate-slide-in">
              Bold, premium pieces built for the city—crafted with intent, not noise.
            </p>

            <div className="d-flex gap-3 justify-content-center mt-4">
              <Link to="/shop" className="btn-ue btn-ue-primary animate-slide-in">
                Explore Drops <i className="bi bi-arrow-right"></i>
              </Link>

              <Link to="/lookbook" className="btn-ue btn-ue-ghost animate-slide-in">
                The Story
              </Link>
            </div>
          </div>
        </div>
      </div>

      <FeaturedDrops />



      <IntroCard />
      <Footer />
    </>
  );
}
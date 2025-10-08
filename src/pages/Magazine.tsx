import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'bootstrap/dist/css/bootstrap.min.css';

interface Shoot {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
}

const Magazine: React.FC = () => {
  const [shoots, setShoots] = useState<Shoot[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShoots = async () => {
      try {
        const response = await fetch('https://urbanera-api-37beaa1d3e9b.herokuapp.com/api/shoots');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Shoots fetched:', data);
        setShoots(data);
      } catch (err: any) {
        console.error('Fetch error:', JSON.stringify(err, null, 2));
        setError('Failed to load shoots. Please try again later.');
      }
    };
    fetchShoots();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  if (error) {
    return <div className="text-center text-danger mt-5">{error}</div>;
  }

  if (shoots.length === 0) {
    return <div className="text-center text-secondary mt-5">No shoots available.</div>;
  }

  return (
    <div className="container mt-5 mt-md-5 pt-5 px-3">
      <h1 className="display-4 text-center mb-4" style={{ color: '#B8860B' }}>The Urban Magazine</h1>
      <Slider {...settings}>
        {shoots.map((shoot) => (
          <div key={shoot.id} className="p-3">
            <div className="d-flex flex-column align-items-center">
              <img
                src={shoot.imageUrl}
                alt={shoot.title}
                className="img-fluid rounded shadow-lg"
                style={{ maxWidth: '800px', height: '500px', objectFit: 'cover' }}
              />
              <div className="text-center mt-3">
                <h2 className="h4 font-weight-bold" style={{ color: '#1C2526' }}>{shoot.title}</h2>
                <p className="text-muted">{shoot.description}</p>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Magazine;
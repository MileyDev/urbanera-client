import { useContext, useState } from 'react';
import axios from 'axios';
import { CartContext } from '../context/CartContext';

// Define types for delivery details and cities
interface DeliveryDetails {
  country: string;
  state: string;
  city: string;
  address: string;
}

// Define cities object type with index signature
interface Cities {
  [key: string]: string[];
}

export default function Cart() {
  const { cart, removeFromCart } = useContext(CartContext);
  const [email, setEmail] = useState('');
  const [deliveryDetails, setDeliveryDetails] = useState<DeliveryDetails>({
    country: '',
    state: '',
    city: '',
    address: '',
  });
  const [error, setError] = useState<string | null>(null);

  // Sample dropdown options (Nigeria-focused, expandable)
  const countries = ['Nigeria'];
  const states = [
    'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
    'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT', 'Gombe', 'Imo',
    'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa',
    'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba',
    'Yobe', 'Zamfara'
  ];
  const cities: Cities = {
    Lagos: ['Ojota', 'Ikeja', 'Lekki', 'Victoria Island', 'Surulere', 'Agege', 'Ikorodu', 'Abule-Egba', 'Ebute Meta', 'Ogba'],
    FCT: ['Abuja', 'Gwagwalada', 'Kuje'],
    Ogun: ['Abeokuta', 'Ijebu-Ode', 'Sango-Ota'],
    // Add more cities for other states as needed
  };

  const total = cart.reduce((sum, item) => sum + item.price * (item.quantity || 0), 0);

  const handleCheckout = async () => {
    if (!email) {
      setError('Please enter your email.');
      return;
    }
    if (!deliveryDetails.country || !deliveryDetails.state || !deliveryDetails.city || !deliveryDetails.address) {
      setError('Please enter all delivery details.');
      return;
    }

    setError(null);
    try {
      const response = await axios.post('https://urbanera-api-37beaa1d3e9b.herokuapp.com/api/checkout/create-checkout-session', {
        email,
        deliveryDetails,
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          description: item.description,
          imageUrl: item.imageUrl,
          quantity: item.quantity || 1,
        })),
      });

      const { checkoutUrl } = response.data;
      if (checkoutUrl) {
        window.location.href = checkoutUrl; // Direct redirect
      } else {
        setError('No checkout URL received. Please try again.');
      }
    } catch (err: any) {
      setError('Failed to initiate checkout. Please try again.');
    }
  };

  return (
    <div className="container-fluid full-screen-section">
      <h1 className="mb-4" style={{ fontWeight: 700 }}>Your Cart</h1>
      {error && <div className="alert alert-danger mb-3">{error}</div>}
      {cart.length === 0 ? (
        <p className="text-muted">Your cart is empty.</p>
      ) : (
        <>
          <div className="row g-4">
            {cart.map(item => (
              <div key={item.id} className="col-md-4">
                <div className="card h-100 shadow-sm">
                  <img
                    src={item.imageUrl}
                    className="card-img-top"
                    alt={item.name}
                    style={{ height: '250px', objectFit: 'cover', width: '100%' }}
                    onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/250')}
                  />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{item.name}</h5>
                    <p className="card-text text-muted">{item.description}</p>
                    <p className="card-text fw-bold">₦{item.price.toLocaleString()} x {(item.quantity || 0)}</p>
                    <button
                      className="btn btn-outline-danger mt-auto"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <h3 style={{ color: '#B8860B' }}>Total: ₦{total.toLocaleString()}</h3>
            <div className="mb-3">
              <label htmlFor="email" className="form-label" style={{ color: '#1C2526' }}>Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="country" className="form-label" style={{ color: '#1C2526' }}>Country</label>
              <select
                id="country"
                className="form-select"
                value={deliveryDetails.country}
                onChange={(e) => setDeliveryDetails({ ...deliveryDetails, country: e.target.value, state: '', city: '' })}
                required
              >
                <option value="">Select Country</option>
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="state" className="form-label" style={{ color: '#1C2526' }}>State</label>
              <select
                id="state"
                className="form-select"
                value={deliveryDetails.state}
                onChange={(e) => setDeliveryDetails({ ...deliveryDetails, state: e.target.value, city: '' })}
                disabled={!deliveryDetails.country}
                required
              >
                <option value="">Select State</option>
                {states.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="city" className="form-label" style={{ color: '#1C2526' }}>City</label>
              <select
                id="city"
                className="form-select"
                value={deliveryDetails.city}
                onChange={(e) => setDeliveryDetails({ ...deliveryDetails, city: e.target.value })}
                disabled={!deliveryDetails.state}
                required
              >
                <option value="">Select City</option>
                {deliveryDetails.state && cities[deliveryDetails.state]?.map((city: string) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="address" className="form-label" style={{ color: '#1C2526' }}>Home Address</label>
              <input 
              className="form-control" 
              id="address"
              value={deliveryDetails.address}
              onChange={(e) => setDeliveryDetails({ ...deliveryDetails, address: e.target.value })}
              disabled={!deliveryDetails.city}
              required
              placeholder="Enter your street address" />
            </div>
            <button className="btn btn-dark btn-lg" onClick={handleCheckout}>
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
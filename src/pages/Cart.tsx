import { useContext, useState } from 'react';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { toast } from 'react-toastify';

interface DeliveryDetails {
  firstName: string;
  lastName: string;
  country: string;
  state: string;
  city: string;
  address: string;
}

interface Cities {
  [key: string]: string[];
}

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useContext(CartContext);
  const [email, setEmail] = useState('');
  const [deliveryDetails, setDeliveryDetails] = useState<DeliveryDetails>({
    firstName: '',
    lastName: '',
    country: '',
    state: '',
    city: '',
    address: '',
  });
  const [error, setError] = useState<string | null>(null);

  const countries = ['Nigeria'];
  const states = [
    'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
    'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT', 'Gombe', 'Imo',
    'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa',
    'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba',
    'Yobe', 'Zamfara'
  ];
  const cities: Cities = {
    Lagos: ['Abule-Egba', 'Agege', 'Ebute Meta', 'Iju-Ishaga', 'Ikeja', 'Ikorodu', 'Lekki', 'Ogba', 'Ojota', 'Oshodi', 'Surulere', 'Victoria Island'],
    FCT: ['Abuja', 'Gwagwalada', 'Kuje'],
    Ogun: ['Abeokuta', 'Agbado', 'Ijebu-Ode', 'Sango-Ota'],
    Oyo: ['Ibadan South', 'Ibadan North', 'Ibadan West'],
  };

  const total = cart.reduce((sum, item) => sum + item.price * (item.quantity || 0), 0);

  const handleCheckout = async () => {
    if (!email) {
      setError('Please enter your email.');
      toast.error('Please enter your email!', { theme: 'dark' });
      return;
    }
    if (!deliveryDetails.firstName || !deliveryDetails.lastName || !deliveryDetails.country || !deliveryDetails.state || !deliveryDetails.city || !deliveryDetails.address) {
      setError('Please enter all delivery details.');
      toast.error('Please enter all delivery details!', { theme: 'dark' });
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
          selectedSize: item.selectedSize,
        })),
      });

      const { checkoutUrl } = response.data;
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        setError('No checkout URL received. Please try again.');
        toast.error('No checkout URL received!', { theme: 'dark' });
      }
    } catch (err: any) {
      setError('Failed to initiate checkout. Please try again.');
      toast.error('Failed to initiate checkout!', { theme: 'dark' });
    }
  };

  return (
    <div className="container-fluid full-screen-section">
      <h1 className="mb-4" style={{ fontWeight: 700, color: 'var(--dark-gold)' }}>Your Cart</h1>
      {error && <div className="alert alert-danger mb-3">{error}</div>}
      {cart.length === 0 ? (
        <p className="text-muted">Your cart is empty.</p>
      ) : (
        <>
          <h4 style={{ color: '#1a1a1a', fontWeight: 900 }}>Order Summary: ₦{total.toLocaleString()}</h4>
          <div className="row g-4">
            {cart.map(item => (
              <div key={`${item.id}-${item.selectedSize}`} className="col-md-4">
                <div className="card h-100 shadow-sm" style={{ background: '#1a1a1a' }}>
                  <img
                    src={item.imageUrl}
                    className="card-img-top"
                    alt={item.name}
                    style={{ height: '250px', objectFit: 'cover', width: '100%' }}
                    onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/250')}
                  />
                  <div className="card-body d-flex flex-column" style={{ color: 'var(--white)' }}>
                    <h5 className="card-title">{item.name}</h5>
                    <p className="card-text text-muted">Size: {item.selectedSize}</p>
                    <p className="card-text text-muted">{item.description}</p>
                    <p className="card-text fw-bold">₦{item.price.toLocaleString()} x {item.quantity}</p>
                    <div className="d-flex gap-2 mt-2">
                      <button
                        className="btn btn-dark btn-sm"
                        style={{ borderColor: 'var(--dark-gold)', color: 'var(--dark-gold)' }}
                        onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity + 1)}
                      >
                        +
                      </button>
                      <button
                        className="btn btn-dark btn-sm"
                        style={{ borderColor: 'var(--dark-gold)', color: 'var(--dark-gold)' }}
                        onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity - 1)}
                      >
                        -
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => removeFromCart(item.id, item.selectedSize)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <button
              className="btn btn-danger mb-4"
              onClick={() => {
                clearCart();
                toast.success('Cart cleared!', { theme: 'dark' });
              }}
            >
              Clear Cart
            </button>
            <h2 style={{ color: 'var(--dark-gold)' }}>Contact Information</h2>
            <div className="mb-3">
              <label htmlFor="firstName" className="form-label" style={{ color: 'var(--white)' }}>First Name</label>
              <input
                type="text"
                className="form-control"
                id="firstName"
                value={deliveryDetails.firstName}
                onChange={(e) => setDeliveryDetails({ ...deliveryDetails, firstName: e.target.value })}
                required
                placeholder="John"
                style={{ backgroundColor: '#1C2526', color: 'var(--white)', borderColor: 'var(--dark-gold)' }}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="lastName" className="form-label" style={{ color: 'var(--white)' }}>Last Name</label>
              <input
                type="text"
                className="form-control"
                id="lastName"
                value={deliveryDetails.lastName}
                onChange={(e) => setDeliveryDetails({ ...deliveryDetails, lastName: e.target.value })}
                placeholder="Doe"
                required
                style={{ backgroundColor: '#1C2526', color: 'var(--white)', borderColor: 'var(--dark-gold)' }}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label" style={{ color: 'var(--white)' }}>Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                style={{ backgroundColor: '#1C2526', color: 'var(--white)', borderColor: 'var(--dark-gold)' }}
              />
            </div>
            <h2 style={{ color: 'var(--dark-gold)' }}>Shipping Address</h2>
            <div className="mb-3">
              <label htmlFor="country" className="form-label" style={{ color: 'var(--white)' }}>Country</label>
              <select
                id="country"
                className="form-select"
                value={deliveryDetails.country}
                onChange={(e) => setDeliveryDetails({ ...deliveryDetails, country: e.target.value, state: '', city: '' })}
                required
                style={{ backgroundColor: '#1C2526', color: 'var(--white)', borderColor: 'var(--dark-gold)' }}
              >
                <option value="">Select Country</option>
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="state" className="form-label" style={{ color: 'var(--white)' }}>State</label>
              <select
                id="state"
                className="form-select"
                value={deliveryDetails.state}
                onChange={(e) => setDeliveryDetails({ ...deliveryDetails, state: e.target.value, city: '' })}
                disabled={!deliveryDetails.country}
                required
                style={{ backgroundColor: '#1C2526', color: 'var(--white)', borderColor: 'var(--dark-gold)' }}
              >
                <option value="">Select State</option>
                {states.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="city" className="form-label" style={{ color: 'var(--white)' }}>City</label>
              <select
                id="city"
                className="form-select"
                value={deliveryDetails.city}
                onChange={(e) => setDeliveryDetails({ ...deliveryDetails, city: e.target.value })}
                disabled={!deliveryDetails.state}
                required
                style={{ backgroundColor: '#1C2526', color: 'var(--white)', borderColor: 'var(--dark-gold)' }}
              >
                <option value="">Select City</option>
                {deliveryDetails.state && cities[deliveryDetails.state]?.map((city: string) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="address" className="form-label" style={{ color: 'var(--white)' }}>Home Address</label>
              <input
                className="form-control"
                id="address"
                value={deliveryDetails.address}
                onChange={(e) => setDeliveryDetails({ ...deliveryDetails, address: e.target.value })}
                disabled={!deliveryDetails.city}
                required
                placeholder="Enter your street address"
                style={{ backgroundColor: '#1C2526', color: 'var(--white)', borderColor: 'var(--dark-gold)' }}
              />
            </div>
            <button
              className="btn btn-dark btn-lg"
              style={{ borderColor: 'var(--dark-gold)', color: 'var(--dark-gold)' }}
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
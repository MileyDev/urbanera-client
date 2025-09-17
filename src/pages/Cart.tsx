import { useContext, useState } from 'react';
import axios from 'axios';
import { CartContext } from '../context/CartContext';

export default function Cart() {
  const { cart, removeFromCart } = useContext(CartContext);
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  console.log('Cart component rendered, cart:', cart); // Debug render

  const total = cart.reduce((sum, item) => sum + item.price * (item.quantity || 0), 0);

  const handleCheckout = async () => {
    console.log('Proceed to Checkout clicked, email:', email, 'cart:', cart); // Debug
    if (!email) {
      setError('Please enter your email.');
      console.log('Error: Email is empty'); // Debug
      return;
    }

    setError(null);
    try {
      console.log('Sending POST to backend:', { email, items: cart }); // Debug
      const response = await axios.post('https://urbanera-api-37beaa1d3e9b.herokuapp.com/api/checkout/create-checkout-session', {
        email,
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          description: item.description,
          imageUrl: item.imageUrl,
          quantity: item.quantity || 1,
        })),
      });

      console.log('Backend response:', response.data); // Debug
      const { checkoutUrl } = response.data;
      if (checkoutUrl) {
        console.log('Redirecting to Paystack:', checkoutUrl); // Debug
        window.location.href = checkoutUrl; // Direct redirect
      } else {
        setError('No checkout URL received. Please try again.');
        console.log('Error: No checkoutUrl in response'); // Debug
      }
    } catch (err: any) {
      console.error('Checkout error:', err.response?.data || err.message); // Debug
      setError('Failed to initiate checkout. Please try again.');
    }
  };

  return (
    <div className="container-fluid full-screen-section">
      <h1 className="mb-4">Your Cart</h1>
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
                    <p className="card-text fw-bold">${item.price.toFixed(2)} x {(item.quantity || 0)}</p>
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
            <h3>Total: ${total.toFixed(2)}</h3>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
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
            <button className="btn btn-dark btn-lg" onClick={handleCheckout}>
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
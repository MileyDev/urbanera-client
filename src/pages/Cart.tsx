import { useContext } from 'react';
import { CartContext } from '../context/CartContext';

export default function Cart() {
  const { cart, removeFromCart, clearCart } = useContext(CartContext);

  const total = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="container py-5">
      <h1 className="mb-4">Your Cart</h1>
      {cart.length === 0 ? (
        <p className="text-muted">Your cart is empty.</p>
      ) : (
        <>
          <div className="row g-4">
            {cart.map((item) => (
              <div key={item.product.id} className="col-12">
                <div className="card mb-3">
                  <div className="row g-0">
                    <div className="col-md-2">
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="img-fluid rounded-start"
                        style={{ maxHeight: '100px', objectFit: 'cover' }}
                      />
                    </div>
                    <div className="col-md-8">
                      <div className="card-body">
                        <h5 className="card-title">{item.product.name}</h5>
                        <p className="card-text">
                          ${item.product.price} x {item.quantity} = $
                          {(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="col-md-2 d-flex align-items-center">
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => removeFromCart(item.product.id)}
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
            <h4>Total: ${total.toFixed(2)}</h4>
            <button className="btn btn-dark me-2">Proceed to Checkout</button>
            <button className="btn btn-outline-danger" onClick={clearCart}>
              Clear Cart
            </button>
          </div>
        </>
      )}
    </div>
  );
}
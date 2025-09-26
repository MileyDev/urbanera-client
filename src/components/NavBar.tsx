import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';

export default function NavBar() {
  const { cart } = useContext(CartContext);
  const itemCount = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);

  return (
    <nav className="navbar navbar-expand-lg sticky-top" style={{ background: 'var(--gradient)' }}>
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/" style={{ color: 'var(--white)' }}>UrbanEra</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/shop" style={{ color: 'var(--white)', transition: 'color 0.3s ease'}}>Shop <i className="bi bi-bag"></i></Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/cart" style={{ color: 'var(--white)', transition: 'color 0.3s ease'}}>
                Cart <i className="bi bi-cart"></i>{itemCount > 0 && <span className="badge bg-light text-dark ms-1">{itemCount}</span>}
              </Link>             
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
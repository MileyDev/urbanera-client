import { Link, useLocation } from "react-router-dom";
import { useContext, useEffect, useMemo, useState } from "react";
import { CartContext } from "../context/CartContext";
import "../NavBar.css";

export default function NavBar() {
  const { cart } = useContext(CartContext);
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const itemCount = useMemo(
    () => cart.reduce((sum, item) => sum + (item.quantity || 0), 0),
    [cart]
  );

  // Close drawer on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Close on ESC
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (open) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // Prevent background scroll when drawer is open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <nav className="navbar ue-nav">
        <div className="container d-flex align-items-center justify-content-between py-2">
          <Link className="navbar-brand fw-bold" to="/">
            UrbanEra
          </Link>

          {/* Desktop links */}
          <div className="d-none d-lg-flex align-items-center gap-3">
            <Link className="ue-link ue-pill" to="/shop">
              Drops <i className="bi bi-bag"></i>
            </Link>

            <Link className="ue-link ue-pill" to="/magazine">
              LookBook <i className="bi bi-book-half"></i>
            </Link>

            <Link className="ue-link ue-pill" to="/cart">
              Cart <i className="bi bi-cart"></i>
              {itemCount > 0 && <span className="ue-badge">{itemCount}</span>}
            </Link>
          </div>

          {/* Mobile drawer button */}
          <button
            className="ue-menu-btn d-lg-none"
            type="button"
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen(true)}
          >
            <i className="bi bi-list" style={{ fontSize: "1.4rem" }}></i>
          </button>
        </div>
      </nav>

      {/* Overlay */}
      <div
        className={`ue-drawer-overlay ${open ? "open" : ""}`}
        onClick={() => setOpen(false)}
        aria-hidden={!open}
      />

      {/* Drawer */}
      <aside className={`ue-drawer ${open ? "open" : ""}`} aria-hidden={!open}>
        <div className="ue-drawer-header">
          <div style={{ color: "rgba(255,255,255,0.92)", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            UrbanEra
          </div>
          <button
            className="ue-menu-btn"
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <nav className="ue-drawer-links">
          <Link className="ue-drawer-link" to="/shop">
            <span>Shop</span> <i className="bi bi-bag"></i>
          </Link>

          <Link className="ue-drawer-link" to="/magazine">
            <span>The Urban LookBook</span> <i className="bi bi-book-half"></i>
          </Link>

          <Link className="ue-drawer-link" to="/cart">
            <span>
              Cart {itemCount > 0 && <span className="ue-badge" style={{ marginLeft: 8 }}>{itemCount}</span>}
            </span>
            <i className="bi bi-cart"></i>
          </Link>
        </nav>
      </aside>
    </>
  );
}
import { useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { type Product } from "../types/Product";
import { toast } from "react-toastify";
import { FaStar } from "react-icons/fa";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState<string>("");

  const ratingText = useMemo(() => {
    if (typeof product.ratingAvg === "number") return product.ratingAvg.toFixed(1);
    return "—";
  }, [product.ratingAvg]);

  const reviewCount = product.reviewCount ?? 0;

  const handleViewDetails = () => navigate(`/product/${product.id}`);

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Please select a size!", { theme: "dark", autoClose: 2500 });
      return;
    }

    addToCart({ ...product, quantity: 1, selectedSize });

    toast.success(`${product.name} (Size: ${selectedSize}) added to cart!`, {
      theme: "dark",
      autoClose: 2500,
    });
  };

  return (
    <div className="ue-product h-100">
      <div className="ue-product-media">
        {product.collection?.title && (
          <div className="ue-tag">
            DROP <b>{product.collection.season ?? ""}</b>
          </div>
        )}

        <img
          src={product.imageUrl}
          className="card-img-top"
          alt={product.name}
          onError={(e) => {
            e.currentTarget.src = "https://via.placeholder.com/250";
          }}
        />
      </div>

      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{product.name}</h5>

        <p className="card-text text-muted mb-3" style={{ minHeight: 42 }}>
          {product.description}
        </p>

        <div className="ue-meta mb-2">
          <span className="ue-price">₦{product.price.toLocaleString()}</span>

          <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <FaStar style={{ color: "var(--accent)" }} />
            {ratingText}
            {reviewCount > 0 ? ` (${reviewCount})` : ""}
          </span>
        </div>

        <div className="mb-3">
          <label htmlFor={`size-${product.id}`} className="form-label" style={{ color: "var(--muted)" }}>
            Size
          </label>

          <select
            id={`size-${product.id}`}
            className="ue-select w-100"
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
          >
            <option value="">Select a size</option>
            {product.sizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <div className="ue-actions mt-auto">
          <button className="ue-btn" onClick={handleViewDetails}>
            View Details
          </button>
          <button className="ue-btn ue-btn-primary" onClick={handleAddToCart}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
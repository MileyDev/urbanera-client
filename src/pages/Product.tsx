import { useState, useEffect, useContext, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import type { Product, Review } from "../types/Product";
import { toast } from "react-toastify";
import { FaStar } from "react-icons/fa";
import ProductCard from "../components/ProductCard";

const API = "https://urbaneraapi.onrender.com/api";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedSize, setSelectedSize] = useState<string>("");

  // Review form
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  // Related products
  const [related, setRelated] = useState<Product[]>([]);
  const [relatedLoading, setRelatedLoading] = useState(false);

  const averageRating = useMemo(() => {
    if (!reviews.length) return null;
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    return Number.isFinite(avg) ? avg : null;
  }, [reviews]);

  useEffect(() => {
    if (!id || isNaN(parseInt(id, 10))) {
      setError("Invalid product ID");
      setLoading(false);
      return;
    }

    const fetchAll = async () => {
      try {
        setLoading(true);
        setError(null);
        setSelectedSize("");
        setRelated([]);
        setReviews([]);

        const [productRes, reviewsRes] = await Promise.all([
          axios.get<Product>(`${API}/products/${id}`),
          axios.get<Review[]>(`${API}/reviews/${id}`),
        ]);

        setProduct(productRes.data);
        setReviews(reviewsRes.data ?? []);
      } catch (err) {
        setError("Failed to load product or reviews.");
        setProduct(null);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [id]);

  // Load "More from this drop"
  useEffect(() => {
    const runRelated = async (slug: string, currentId: number) => {
      try {
        setRelatedLoading(true);

        const res = await axios.get<Product[]>(`${API}/products`, {
          params: { collection: slug },
        });

        const items = (res.data ?? [])
          .filter((p) => p.id !== currentId)
          .slice(0, 6);

        setRelated(items);
      } catch {
        setRelated([]);
      } finally {
        setRelatedLoading(false);
      }
    };

    const slug = product?.collection?.slug;
    const currentId = product?.id;

    if (slug && typeof currentId === "number") {
      runRelated(slug, currentId);
    }
  }, [product?.collection?.slug, product?.id]);

  const handleAddToCart = () => {
    if (!product) return;

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

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!product) return;

    if (!username.trim()) {
      toast.error("Please enter a username!", { theme: "dark", autoClose: 2500 });
      return;
    }

    if (!rating || rating < 1 || rating > 5) {
      toast.error("Please select a rating between 1 and 5!", { theme: "dark", autoClose: 2500 });
      return;
    }

    try {
      setSubmitting(true);

      await axios.post(`${API}/reviews`, {
        productId: product.id,
        username: username.trim(),
        rating,
        comment: comment.trim(),
      });

      toast.success("Review submitted!", { theme: "dark", autoClose: 2500 });

      setUsername("");
      setRating(0);
      setComment("");

      const reviewsRes = await axios.get<Review[]>(`${API}/reviews/${product.id}`);
      setReviews(reviewsRes.data ?? []);
    } catch {
      toast.error("Failed to submit review.", { theme: "dark", autoClose: 2500 });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container-fluid section text-center">
        <div className="text-muted">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid section text-center">
        <div className="text-danger">{error}</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-fluid section text-center">
        <div className="text-muted">Product not found</div>
      </div>
    );
  }

  return (
    <>
      <div className="container-fluid section section--alt">
        <div className="container">
          {/* Drop link */}
          {product.collection?.slug && (
            <div style={{ marginBottom: 16 }}>
              <Link
                to={`/drops/${product.collection.slug}`}
                className="ue-pill ue-link"
                style={{ display: "inline-flex" }}
              >
                Drop: {product.collection.title} • {product.collection.season}
                <i className="bi bi-arrow-right" style={{ marginLeft: 10 }} />
              </Link>
            </div>
          )}

          <div className="row g-4 align-items-start">
            {/* Image */}
            <div className="col-lg-6">
              <div className="ue-product" style={{ borderRadius: 18 }}>
                <div className="ue-product-media">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="card-img-top"
                    style={{ height: 520 }}
                    onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/520")}
                  />
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="col-lg-6">
              <h1 className="hero-title" style={{ fontSize: "clamp(34px, 4vw, 56px)" }}>
                {product.name.split(" ").slice(0, -1).join(" ")}{" "}
                <span className="accent">{product.name.split(" ").slice(-1)}</span>
              </h1>

              <div className="ue-meta" style={{ marginTop: 10 }}>
                <span className="ue-price" style={{ fontSize: 20 }}>
                  ₦{product.price.toLocaleString()}
                </span>

                <span style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "var(--muted)" }}>
                  <FaStar style={{ color: "var(--accent)" }} />
                  {averageRating ? averageRating.toFixed(1) : "—"}
                  {reviews.length ? ` (${reviews.length})` : ""}
                </span>
              </div>

              <p style={{ color: "var(--muted)", marginTop: 16, lineHeight: 1.8 }}>
                {product.description}
              </p>

              <div className="mt-4">
                <label htmlFor="size-select" className="form-label" style={{ color: "var(--muted)" }}>
                  Size
                </label>

                <select
                  id="size-select"
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

              <div className="ue-actions mt-4">
                <button className="ue-btn" onClick={() => navigate(-1)}>
                  Back
                </button>
                <button className="ue-btn ue-btn-primary" onClick={handleAddToCart}>
                  Add to Cart <i className="bi bi-cart" style={{ marginLeft: 8 }} />
                </button>
              </div>
            </div>
          </div>

          {/* Review form */}
          <div className="mt-5">
            <h2 className="section-title" style={{ textAlign: "left" }}>
              Leave a Review
            </h2>

            <form onSubmit={handleSubmitReview} style={{ maxWidth: 760 }}>
              <div className="mb-3">
                <label htmlFor="username" className="form-label" style={{ color: "var(--muted)" }}>
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  className="form-control"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Your username"
                />
              </div>

              <div className="mb-3">
                <label className="form-label" style={{ color: "var(--muted)" }}>
                  Rating
                </label>
                <div className="d-flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      size={22}
                      color={star <= rating ? "var(--accent)" : "rgba(255,255,255,0.25)"}
                      style={{ cursor: "pointer" }}
                      onClick={() => setRating(star)}
                    />
                  ))}
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="comment" className="form-label" style={{ color: "var(--muted)" }}>
                  Comment
                </label>
                <textarea
                  id="comment"
                  className="form-control"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Your review"
                  rows={4}
                />
              </div>

              <button className="ue-btn ue-btn-primary" type="submit" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </div>

          {/* Reviews list */}
          <div className="mt-5">
            <h2 className="section-title" style={{ textAlign: "left" }}>
              Reviews
            </h2>

            {reviews.length ? (
              <div style={{ maxWidth: 760 }}>
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="mb-3"
                    style={{
                      padding: 16,
                      borderRadius: 16,
                      border: "1px solid rgba(255,255,255,0.10)",
                      background: "rgba(255,255,255,0.02)",
                      color: "var(--text)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                        <FaStar style={{ color: "var(--accent)" }} />
                        <span style={{ fontWeight: 800 }}>{review.rating} / 5</span>
                      </div>
                      <div style={{ color: "var(--subtle)", fontSize: 13 }}>
                        {new Date(review.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    <div style={{ marginTop: 10, color: "var(--muted)", lineHeight: 1.7 }}>
                      {review.comment}
                    </div>

                    <div style={{ marginTop: 10, color: "var(--subtle)", fontSize: 13 }}>
                      Posted by {review.user?.username || "Anonymous"}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted">No reviews yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* More from this drop */}
      {product.collection?.slug && (
        <div className="container-fluid section">
          <div className="container">
            <div className="d-flex align-items-end justify-content-between flex-wrap gap-2">
              <div>
                <h2 className="section-title" style={{ textAlign: "left", marginBottom: 8 }}>
                  More from this drop
                </h2>
                <div style={{ color: "var(--muted)" }}>
                  {product.collection.title} • {product.collection.season}
                </div>
              </div>

              <Link to={`/drops/${product.collection.slug}`} className="ue-link">
                View full drop <i className="bi bi-arrow-right" />
              </Link>
            </div>

            <div style={{ marginTop: 20 }}>
              {relatedLoading && <div className="text-muted">Loading more pieces...</div>}

              {!relatedLoading && related.length === 0 && (
                <div className="text-muted">No other pieces in this drop yet.</div>
              )}

              {!relatedLoading && related.length > 0 && (
                <div className="row g-4">
                  {related.map((p) => (
                    <div key={p.id} className="col-md-4">
                      <ProductCard product={p} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
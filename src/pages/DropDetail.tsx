import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import type { CollectionDetail } from "../types/Collection";

const API = "https://urbaneraapi.onrender.com/api";

export default function DropDetail() {
  const { slug } = useParams();

  const [drop, setDrop] = useState<CollectionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await axios.get<CollectionDetail>(`${API}/collections/${slug}`);
        setDrop(res.data);
      } catch (e) {
        setError("Drop not found or failed to load.");
        setDrop(null);
      } finally {
        setLoading(false);
      }
    };

    if (slug) run();
  }, [slug]);

  const storyParagraphs = useMemo(() => {
    if (!drop?.story) return [];
    // split on blank lines, fallback to single paragraphs
    return drop.story
      .split(/\n\s*\n/g)
      .map((p) => p.trim())
      .filter(Boolean);
  }, [drop?.story]);

  if (loading) {
    return (
      <div className="container-fluid section text-center">
        <div className="text-muted">Loading drop...</div>
      </div>
    );
  }

  if (error || !drop) {
    return (
      <div className="container-fluid section text-center">
        <h1 className="section-title">Drop not found</h1>
        <p className="section-lead">{error ?? "This collection doesn’t exist."}</p>
      </div>
    );
  }

  return (
    <>
      <div className="container-fluid hero-section">
        <img
          src={drop.heroImageUrl}
          alt={drop.title}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: 0,
          }}
        />

        <div className="row align-items-center text-center">
          <div className="col-12 hero-copy">
            <div className="hero-eyebrow">{drop.season}</div>

            <h1 className="hero-title">
              {drop.title.split(" ").slice(0, -1).join(" ")}{" "}
              <span className="accent">{drop.title.split(" ").slice(-1)}</span>
            </h1>

            <p className="hero-sub">{drop.statement}</p>
          </div>
        </div>
      </div>

      <div className="container-fluid section section--alt">
        <div className="container">
          <h2 className="section-title" style={{ textAlign: "left" }}>
            The Story
          </h2>

          <div style={{ maxWidth: 840, color: "var(--muted)", lineHeight: 1.8 }}>
            {storyParagraphs.length > 0
              ? storyParagraphs.map((p, idx) => (
                  <p key={idx} style={{ marginBottom: 16 }}>
                    {p}
                  </p>
                ))
              : <p style={{ marginBottom: 16 }}>{drop.story}</p>}
          </div>
        </div>
      </div>

      <div className="container-fluid section">
        <h2 className="section-title">Pieces in this Drop</h2>

        <div className="container">
          <div className="row g-4">
            {drop.products.map((product) => (
              <div key={product.id} className="col-md-4">
                <ProductCard product={product} />
              </div>
            ))}

            {drop.products.length === 0 && (
              <div className="text-center text-muted">No products in this drop yet.</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
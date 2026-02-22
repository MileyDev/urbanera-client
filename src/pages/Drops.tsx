import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import type { CollectionListItem } from "../types/Collection";

const API = "https://urbaneraapi.onrender.com/api";

export default function Drops() {
  const [drops, setDrops] = useState<CollectionListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get<CollectionListItem[]>(`${API}/collections`);
        setDrops(res.data);
      } catch (e) {
        setError("Failed to load drops.");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  return (
    <div className="container-fluid section section--alt">
      <h1 className="section-title">Drops</h1>
      <p className="section-lead">
        Collections with story. Built from Lagos roots, executed for the world.
      </p>

      {loading && <div className="text-center text-muted">Loading drops...</div>}
      {error && <div className="text-center text-danger">{error}</div>}

      {!loading && !error && (
        <div className="container">
          <div className="row g-4">
            {drops.map((drop) => (
              <div className="col-lg-6" key={drop.slug}>
                <Link to={`/drops/${drop.slug}`} style={{ textDecoration: "none" }}>
                  <div className="ue-drop-card">
                    <img src={drop.coverImageUrl} alt={drop.title} />
                    <div className="ue-drop-overlay" />
                    <div className="ue-drop-content">
                      <span className="ue-drop-season">
                        {drop.season} • {drop.productCount} pieces
                      </span>
                      <div className="ue-drop-title">{drop.title}</div>
                      <div className="ue-drop-statement">{drop.statement}</div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}

            {drops.length === 0 && (
              <div className="text-center text-muted">No drops published yet.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
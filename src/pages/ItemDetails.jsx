import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Package, MapPin, CalendarDays, Bus } from "lucide-react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import StatusBadge from "../components/StatusBadge";
import Feedback from "../components/Feedback";
import Field from "../components/Field";
export default function ItemDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [item, setItem] = useState(null);
  const [error, setError] = useState("");
  const [proof, setProof] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    setItem(null);
    setError("");
    setMessage("");
    api(`/items/${id}`)
      .then(setItem)
      .catch((err) => setError(err.message));
  }, [id]);
  async function claim(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api("/claims", {
        method: "POST",
        body: { item_id: Number(id), proof },
      });
      setMessage("Claim submitted. Follow its progress in My dashboard.");
      setProof("");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <Link className="back-link" to="/">
        ← Back to found items
      </Link>
      <Feedback error={error} loading={!item && !error} />
      {item && (
        <div className="row g-5 mt-1">
          <div className="col-lg-6">
            <div className="detail-visual">
              {item.image_data ? (
                <img src={item.image_data} alt={item.title} />
              ) : (
                <Package size={96} strokeWidth={1} />
              )}
            </div>
            {item.is_sample && (
              <p className="small text-secondary mt-3">
                Sample record for demonstrating the application.
              </p>
            )}
          </div>
          <section className="col-lg-6">
            <StatusBadge status={item.status} />
            <h1 className="mt-3">{item.title}</h1>
            <p className="lead">{item.description}</p>
            <dl className="item-facts">
              <div>
                <dt>
                  <MapPin size={18} /> Location
                </dt>
                <dd>{item.location}</dd>
              </div>
              <div>
                <dt>
                  <CalendarDays size={18} /> Date
                </dt>
                <dd>{String(item.event_date).slice(0, 10)}</dd>
              </div>
              <div>
                <dt>
                  <Bus size={18} /> Route
                </dt>
                <dd>{item.route || "Not specified"}</dd>
              </div>
              <div>
                <dt>Category</dt>
                <dd>{item.category}</dd>
              </div>
            </dl>
            {item.kind === "found" && item.status === "Found" && (
              <section className="claim-panel">
                <h2>Is this yours?</h2>
                <p>
                  Describe a unique detail or what is inside. An employee will
                  check your claim before arranging collection.
                </p>
                <Feedback message={message} />
                {!message &&
                  (user?.role === "customer" ? (
                    <form onSubmit={claim}>
                      <Field
                        multiline
                        label="Proof of ownership (private)"
                        name="proof"
                        value={proof}
                        onChange={(e) => setProof(e.target.value)}
                        minLength={15}
                        maxLength={2000}
                        required
                      />
                      <button className="btn btn-primary" disabled={busy}>
                        {busy ? "Submitting…" : "Submit ownership claim"}
                      </button>
                    </form>
                  ) : !user ? (
                    <Link
                      className="btn btn-primary"
                      to="/login"
                      state={{ from: `/items/${id}` }}
                    >
                      Log in to claim
                    </Link>
                  ) : (
                    <p>Employee accounts review claims in the dashboard.</p>
                  ))}
              </section>
            )}
            {item.status !== "Found" && (
              <p className="alert alert-light border">
                This item is currently {item.status.toLowerCase()}.
              </p>
            )}
          </section>
        </div>
      )}
    </>
  );
}

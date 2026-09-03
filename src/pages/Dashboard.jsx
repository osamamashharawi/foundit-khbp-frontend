import { useCallback, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Plus } from "lucide-react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import Feedback from "../components/Feedback";
import StatusBadge from "../components/StatusBadge";
import EmptyState from "../components/EmptyState";
import ClaimsList from "../components/ClaimsList";
export default function Dashboard() {
  const { user } = useAuth();
  const location = useLocation();
  const [items, setItems] = useState([]);
  const [claims, setClaims] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const load = useCallback(async () => {
    const [a, b] = await Promise.all([api("/items/mine"), api("/claims")]);
    setItems(a);
    setClaims(b);
  }, []);
  useEffect(() => {
    load()
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [load]);
  async function remove(item) {
    if (!window.confirm(`Delete “${item.title}”? This cannot be undone.`))
      return;
    setError("");
    setBusy(true);
    try {
      await api(`/items/${item.id}`, { method: "DELETE" });
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">YOUR PERSONAL SPACE</span>
          <h1>Hello, {user.name.split(" ")[0]}.</h1>
          <p>Keep track of your reports and ownership claims.</p>
        </div>
        <Link className="btn btn-primary" to="/report">
          <Plus size={18} /> Report lost item
        </Link>
      </div>
      <Feedback
        error={error}
        loading={loading}
        message={location.state?.message}
      />
      <div className="row g-5 mt-1">
        <section className="col-lg-6">
          <h2 className="mb-4">
            My reports <span className="count">{items.length}</span>
          </h2>
          {!loading &&
            (items.length ? (
              items.map((item) => (
                <article className="surface p-4 mb-3" key={item.id}>
                  <div className="d-flex justify-content-between gap-3">
                    <h3>{item.title}</h3>
                    <StatusBadge status={item.status} />
                  </div>
                  <p className="text-secondary">
                    {item.location} · {String(item.event_date).slice(0, 10)}
                  </p>
                  <p>{item.description}</p>
                  <div className="d-flex gap-2">
                    <Link
                      className="btn btn-sm btn-outline-primary"
                      to={`/items/${item.id}`}
                    >
                      View
                    </Link>
                    {item.status === "Lost" && (
                      <>
                        <Link
                          className="btn btn-sm btn-outline-primary"
                          to={`/items/${item.id}/edit`}
                        >
                          Edit
                        </Link>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          disabled={busy}
                          onClick={() => remove(item)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </article>
              ))
            ) : (
              <EmptyState title="No lost reports">
                Create a report when something goes missing.
              </EmptyState>
            ))}
        </section>
        <section className="col-lg-6">
          <h2 className="mb-4">
            My claims <span className="count">{claims.length}</span>
          </h2>
          {!loading && <ClaimsList claims={claims} />}
        </section>
      </div>
    </>
  );
}

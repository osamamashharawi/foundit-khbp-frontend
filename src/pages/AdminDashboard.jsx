import { useCallback, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Plus } from "lucide-react";
import { api } from "../services/api";
import Feedback from "../components/Feedback";
import StatusBadge from "../components/StatusBadge";
import ClaimsList from "../components/ClaimsList";
export default function AdminDashboard() {
  const [tab, setTab] = useState("items");
  const [items, setItems] = useState([]);
  const [claims, setClaims] = useState([]);
  const [users, setUsers] = useState([]);
  const [summary, setSummary] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const location = useLocation();
  const load = useCallback(async () => {
    const [a, b, c, d] = await Promise.all([
      api("/admin/items"),
      api("/claims"),
      api("/admin/users"),
      api("/admin/summary"),
    ]);
    setItems(a);
    setClaims(b);
    setUsers(c);
    setSummary(d);
  }, []);
  useEffect(() => {
    load()
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [load]);
  async function act(path, method, body) {
    setError("");
    setBusy(true);
    try {
      await api(path, { method, body });
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
          <span className="eyebrow">EMPLOYEE WORKSPACE</span>
          <h1>Park overview</h1>
          <p>Manage reports, verify ownership and reunite belongings.</p>
        </div>
        <Link className="btn btn-primary" to="/admin/new">
          <Plus size={18} /> Register found item
        </Link>
      </div>
      <Feedback
        error={error}
        loading={loading}
        message={location.state?.message}
      />
      <div className="row g-3 mb-5">
        {[
          ["total", "Total reports"],
          ["found", "Found items"],
          ["pending", "Pending claims"],
          ["returned", "Returned"],
        ].map(([key, label]) => (
          <div className="col-6 col-lg-3" key={key}>
            <div className="stat-card">
              <span>{label}</span>
              <strong>{loading ? "—" : summary[key] || 0}</strong>
            </div>
          </div>
        ))}
      </div>
      <div className="dashboard-tabs mb-4" aria-label="Employee sections">
        {["items", "claims", "users"].map((name) => (
          <button
            aria-pressed={tab === name}
            onClick={() => setTab(name)}
            key={name}
            className={tab === name ? "active" : ""}
          >
            {name === "items"
              ? "All items"
              : name === "claims"
                ? "Ownership claims"
                : "Users"}
          </button>
        ))}
      </div>
      {tab === "claims" && (
        <ClaimsList claims={claims} admin onRefresh={load} />
      )}
      {tab === "items" && (
        <div className="surface table-responsive">
          <table className="table align-middle mb-0">
            <thead>
              <tr>
                <th>Item</th>
                <th>Type / location</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>
                    <Link to={`/items/${item.id}`} className="fw-semibold">
                      {item.title}
                    </Link>
                    {item.is_sample && (
                      <small className="d-block text-secondary">
                        Sample record
                      </small>
                    )}
                  </td>
                  <td>
                    {item.kind}
                    <small className="d-block text-secondary">
                      {item.location}
                    </small>
                  </td>
                  <td>
                    <StatusBadge status={item.status} />
                  </td>
                  <td>
                    <div className="d-flex flex-wrap gap-2">
                      <Link
                        className="btn btn-sm btn-outline-primary"
                        to={`/items/${item.id}/edit`}
                      >
                        Edit
                      </Link>
                      <button
                        disabled={busy}
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => {
                          if (
                            window.confirm(
                              `Delete “${item.title}” and its claims?`,
                            )
                          )
                            act(`/items/${item.id}`, "DELETE");
                        }}
                      >
                        Delete
                      </button>
                      {item.kind === "lost" && item.status !== "Returned" && (
                        <button
                          disabled={busy}
                          className="btn btn-sm btn-outline-primary"
                          onClick={() =>
                            act(`/admin/items/${item.id}/status`, "PATCH", {
                              status: {
                                Lost: "Found",
                                Found: "Matched",
                                Matched: "Returned",
                              }[item.status],
                            })
                          }
                        >
                          Mark{" "}
                          {
                            {
                              Lost: "Found",
                              Found: "Matched",
                              Matched: "Returned",
                            }[item.status]
                          }
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && !items.length && <p className="p-4">No reports yet.</p>}
        </div>
      )}
      {tab === "users" && (
        <div className="surface table-responsive">
          <table className="table align-middle mb-0">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Access</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    {user.role === "customer" ? (
                      <button
                        disabled={busy}
                        className={`btn btn-sm ${user.active ? "btn-outline-danger" : "btn-outline-primary"}`}
                        onClick={() => {
                          if (
                            window.confirm(
                              `${user.active ? "Deactivate" : "Activate"} ${user.name}'s account?`,
                            )
                          )
                            act(`/admin/users/${user.id}`, "PATCH", {
                              active: !user.active,
                            });
                        }}
                      >
                        {user.active ? "Deactivate" : "Activate"}
                      </button>
                    ) : (
                      "Employee"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

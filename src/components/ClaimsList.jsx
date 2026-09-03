import { useState } from "react";
import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";
import Feedback from "./Feedback";
import EmptyState from "./EmptyState";
import { api } from "../services/api";
export default function ClaimsList({ claims, admin = false, onRefresh }) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(null);
  const [notes, setNotes] = useState({});
  async function review(claim, status) {
    setError("");
    setBusy(claim.id);
    try {
      await api(`/claims/${claim.id}`, {
        method: "PATCH",
        body: { status, review_note: notes[claim.id] || "" },
      });
      await onRefresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(null);
    }
  }
  return (
    <>
      <Feedback error={error} />
      {claims.length ? (
        claims.map((claim) => (
          <article className="claim-row surface p-4 mb-3" key={claim.id}>
            <div className="d-flex justify-content-between gap-3">
              <h3>
                <Link to={`/items/${claim.item_id}`}>{claim.title}</Link>
              </h3>
              <StatusBadge status={claim.status} />
            </div>
            <p className="small text-secondary">
              Claim #{claim.id} · {String(claim.created_at).slice(0, 10)}
              {admin && ` · ${claim.claimant_name}`}
            </p>
            <p className="proof-text">{claim.proof}</p>
            {claim.review_note && (
              <p className="review-note">
                <strong>Employee note:</strong> {claim.review_note}
              </p>
            )}
            {claim.status === "Approved" && !admin && (
              <p>
                Your ownership claim was approved. Follow the employee’s
                collection instructions above.
              </p>
            )}
            {admin && ["Pending", "Approved"].includes(claim.status) && (
              <>
                <label className="form-label" htmlFor={`note-${claim.id}`}>
                  Review / collection instructions
                </label>
                <textarea
                  id={`note-${claim.id}`}
                  className="form-control mb-3"
                  maxLength={1000}
                  value={notes[claim.id] || ""}
                  onChange={(e) =>
                    setNotes({ ...notes, [claim.id]: e.target.value })
                  }
                />
                <div className="d-flex flex-wrap gap-2">
                  {(claim.status === "Pending"
                    ? ["Approved", "Rejected"]
                    : ["Returned"]
                  ).map((status) => (
                    <button
                      key={status}
                      disabled={busy !== null}
                      className={`btn ${status === "Rejected" ? "btn-outline-danger" : "btn-primary"}`}
                      onClick={() => review(claim, status)}
                    >
                      {busy === claim.id
                        ? "Saving…"
                        : status === "Approved"
                          ? "Approve claim"
                          : status === "Rejected"
                            ? "Reject claim"
                            : "Confirm item returned"}
                    </button>
                  ))}
                </div>
              </>
            )}
          </article>
        ))
      ) : (
        <EmptyState title="No claims yet">
          Ownership claims will appear here.
        </EmptyState>
      )}
    </>
  );
}

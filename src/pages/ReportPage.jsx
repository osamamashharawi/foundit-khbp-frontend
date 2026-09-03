import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../services/api";
import ItemForm from "../components/ItemForm";
import Feedback from "../components/Feedback";
export default function ReportPage({ found = false }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    if (id)
      api(`/items/${id}`)
        .then(setItem)
        .catch((err) => setError(err.message));
  }, [id]);
  async function save(body) {
    await api(id ? `/items/${id}` : "/items", {
      method: id ? "PUT" : "POST",
      body,
    });
    navigate(found || item?.kind === "found" ? "/admin" : "/dashboard", {
      state: { message: id ? "Report updated." : "Item saved successfully." },
    });
  }
  return (
    <div className="narrow-page">
      <Link className="back-link" to={found ? "/admin" : "/dashboard"}>
        ← Back to dashboard
      </Link>
      <h1>
        {id
          ? "Edit item"
          : found
            ? "Register a found item"
            : "Report a lost item"}
      </h1>
      <p className="text-secondary mb-4">
        {found
          ? "Help someone find their way back to a missing belonging."
          : "Tell us what went missing and where. You can edit your report while it is still marked Lost."}
      </p>
      <Feedback error={error} loading={Boolean(id && !item && !error)} />
      {(!id || item) && (
        <div className="surface p-4 p-md-5">
          <ItemForm
            key={id || "new"}
            initial={item}
            kind={item?.kind || (found ? "found" : "lost")}
            onSave={save}
          />
        </div>
      )}
    </div>
  );
}

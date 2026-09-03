import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import Field from "../components/Field";
import Feedback from "../components/Feedback";
export default function Profile() {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function save(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    setBusy(true);
    try {
      setUser(await api("/auth/me", { method: "PUT", body: { name, phone } }));
      setMessage("Your profile has been updated.");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="narrow-page">
      <h1>My profile</h1>
      <p className="text-secondary">
        Keep your name and contact number up to date.
      </p>
      <div className="surface p-4 mt-4">
        <Feedback error={error} message={message} />
        <form onSubmit={save}>
          <Field
            label="Full name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            minLength={2}
            maxLength={80}
          />
          <Field
            label="Phone number"
            name="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            maxLength={25}
          />
          <Field
            label="Account email"
            name="email"
            value={user.email}
            readOnly
          />
          <button className="btn btn-primary" disabled={busy}>
            {busy ? "Saving…" : "Save profile"}
          </button>
        </form>
      </div>
    </section>
  );
}

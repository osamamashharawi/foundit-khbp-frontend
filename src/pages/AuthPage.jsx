import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Field from "../components/Field";
import Feedback from "../components/Feedback";
export default function AuthPage({ register = false }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  function change(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }
  async function submit(event) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const user = await signIn(
        register ? "/auth/register" : "/auth/login",
        form,
      );
      navigate(
        location.state?.from ||
          (user.role === "admin" ? "/admin" : "/dashboard"),
        { replace: true },
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="auth-layout">
      <aside className="auth-story">
        <span className="eyebrow">A LITTLE HELP. A HAPPY REUNION.</span>
        <h1>
          Your belongings.
          <br />
          Back where they belong.
        </h1>
        <p>
          One place to report a lost item, find a possible match, and follow
          your claim.
        </p>
        <ShieldCheck size={44} />
        <p className="small mt-3">
          Ownership details are only visible to you and authorised employees.
        </p>
      </aside>
      <section className="form-panel">
        <h2>{register ? "Create your account" : "Welcome back"}</h2>
        <p className="text-secondary">
          {register
            ? "Start with your details below."
            : "Log in to manage your reports and claims."}
        </p>
        <Feedback error={error} />
        <form onSubmit={submit}>
          {register && (
            <>
              <Field
                label="Full name"
                name="name"
                value={form.name}
                onChange={change}
                required
                minLength={2}
                maxLength={80}
                autoComplete="name"
              />
              <Field
                label="Phone number (optional)"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={change}
                maxLength={25}
                autoComplete="tel"
              />
            </>
          )}
          <Field
            label="Email address"
            name="email"
            type="email"
            value={form.email}
            onChange={change}
            required
            maxLength={254}
            autoComplete="email"
          />
          <Field
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={change}
            required
            minLength={register ? 8 : 1}
            maxLength={72}
            autoComplete={register ? "new-password" : "current-password"}
          />
          {register && (
            <p className="small text-secondary">
              Use at least 8 characters. Employee accounts are created by the
              system owner.
            </p>
          )}
          <button disabled={busy} className="btn btn-primary w-100">
            {busy ? "Please wait…" : register ? "Create account" : "Log in"}
          </button>
        </form>
        <p className="mt-4">
          {register ? "Already registered?" : "New here?"}{" "}
          <Link to={register ? "/login" : "/register"}>
            {register ? "Log in" : "Create an account"}
          </Link>
        </p>
      </section>
    </div>
  );
}

import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  async function leave() {
    setError("");
    setBusy(true);

    try {
      await logout();
      navigate("/");
      setOpen(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link
          className="brand"
          to="/"
          onClick={() => setOpen(false)}
          aria-label="FoundIT — King Hussein Business Park home"
        >
          <span className="navbar-logos">
            <img
              className="foundit-logo"
              src="/branding/foundit.png"
              alt="FoundIT"
              width="150"
              height="60"
            />

            <img
              className="khbp-navbar-logo"
              src="/branding/khbp.png"
              alt="King Hussein Business Park"
              width="180"
              height="76"
            />
          </span>
        </Link>

        <button
          type="button"
          className="menu-toggle"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="main-nav"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>

        <nav
          id="main-nav"
          className={open ? "main-nav open" : "main-nav"}
          aria-label="Main navigation"
        >
          <NavLink to="/" end onClick={() => setOpen(false)}>
            Found items
          </NavLink>

          <NavLink to="/report" onClick={() => setOpen(false)}>
            Report lost item
          </NavLink>

          {user ? (
            <>
              <NavLink
                to={user.role === "admin" ? "/admin" : "/dashboard"}
                onClick={() => setOpen(false)}
              >
                {user.role === "admin"
                  ? "Employee dashboard"
                  : "My dashboard"}
              </NavLink>

              <NavLink to="/profile" onClick={() => setOpen(false)}>
                Profile
              </NavLink>

              <button
                type="button"
                className="btn btn-outline-primary btn-sm"
                disabled={busy}
                onClick={leave}
              >
                {busy ? "Logging out…" : "Log out"}
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" onClick={() => setOpen(false)}>
                Log in
              </NavLink>

              <Link
                className="btn btn-primary btn-sm"
                to="/register"
                onClick={() => setOpen(false)}
              >
                Create account
              </Link>
            </>
          )}
        </nav>
      </div>

      {error && (
        <div role="alert" className="container text-danger pb-3">
          {error}
        </div>
      )}
    </header>
  );
}
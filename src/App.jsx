import { useEffect } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import FoundItems from "./pages/FoundItems";
import AuthPage from "./pages/AuthPage";
import ItemDetails from "./pages/ItemDetails";
import ReportPage from "./pages/ReportPage";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Profile from "./pages/Profile";
export default function App() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Navbar />
      <main id="main" className="container main-content">
        <Routes>
          <Route path="/" element={<FoundItems />} />
          <Route path="/found" element={<FoundItems />} />
          <Route path="/login" element={<AuthPage key="login" />} />
          <Route
            path="/register"
            element={<AuthPage key="register" register />}
          />
          <Route path="/items/:id" element={<ItemDetails />} />
          <Route
            path="/report"
            element={
              <ProtectedRoute>
                <ReportPage key="new-lost" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/items/:id/edit"
            element={
              <ProtectedRoute>
                <ReportPage key="edit" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute admin>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/new"
            element={
              <ProtectedRoute admin>
                <ReportPage key="new-found" found />
              </ProtectedRoute>
            }
          />
          <Route
            path="*"
            element={
              <section className="empty-state">
                <h1>Page not found</h1>
                <Link className="btn btn-primary" to="/">
                  Browse found items
                </Link>
              </section>
            }
          />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

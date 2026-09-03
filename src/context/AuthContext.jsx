import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../services/api";
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const expire = () => setUser(null);
    window.addEventListener("session-expired", expire);
    if (sessionStorage.getItem("lostFoundToken"))
      api("/auth/me")
        .then(setUser)
        .catch(() => sessionStorage.removeItem("lostFoundToken"))
        .finally(() => setLoading(false));
    else setLoading(false);
    return () => window.removeEventListener("session-expired", expire);
  }, []);
  async function signIn(path, body) {
    const data = await api(path, { method: "POST", body });
    sessionStorage.setItem("lostFoundToken", data.token);
    setUser(data.user);
    return data.user;
  }
  async function logout() {
    await api("/auth/logout", { method: "POST" });
    sessionStorage.removeItem("lostFoundToken");
    setUser(null);
  }
  return (
    <AuthContext.Provider value={{ user, loading, signIn, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
export function useAuth() {
  return useContext(AuthContext);
}

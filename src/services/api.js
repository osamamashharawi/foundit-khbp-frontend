const base = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace(/\/$/, "");
export async function api(path, options = {}) {
  const token = sessionStorage.getItem("lostFoundToken");
  let response;
  try {
    response = await fetch(`${base}${path}`, {
      ...options,
      signal: options.signal || AbortSignal.timeout(15000),
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
      body:
        options.body === undefined ? undefined : JSON.stringify(options.body),
    });
  } catch {
    throw new Error(
      "Cannot reach the server. Check your connection and try again.",
    );
  }
  const data = await response
    .json()
    .catch(() => ({ message: "The server returned an invalid response." }));
  if (!response.ok) {
    if (response.status === 401 && !path.startsWith("/auth/login")) {
      sessionStorage.removeItem("lostFoundToken");
      window.dispatchEvent(new Event("session-expired"));
    }
    throw new Error(data.message || "Request failed. Please try again.");
  }
  return data;
}

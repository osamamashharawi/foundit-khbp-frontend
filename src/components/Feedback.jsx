export default function Feedback({ error, loading, message }) {
  if (error)
    return (
      <div role="alert" className="alert alert-danger">
        {error}
      </div>
    );
  if (loading)
    return (
      <p role="status" className="loading-text">
        Loading…
      </p>
    );
  if (message)
    return (
      <div role="status" className="alert alert-success">
        {message}
      </div>
    );
  return null;
}

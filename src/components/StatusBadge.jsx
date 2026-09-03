export default function StatusBadge({ status }) {
  return (
    <span className={`status status-${status.toLowerCase()}`}>{status}</span>
  );
}

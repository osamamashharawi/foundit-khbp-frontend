import { Search } from "lucide-react";
export default function EmptyState({ title = "Nothing here yet", children }) {
  return (
    <div className="empty-state">
      <Search size={30} aria-hidden="true" />
      <h3>{title}</h3>
      <p>{children}</p>
    </div>
  );
}

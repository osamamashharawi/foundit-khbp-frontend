import { Link } from "react-router-dom";
import {
  Backpack,
  KeyRound,
  Smartphone,
  Wallet,
  FileText,
  Shirt,
  Package,
  MapPin,
  ArrowUpRight,
} from "lucide-react";
import StatusBadge from "./StatusBadge";
const icons = {
  Bags: Backpack,
  Keys: KeyRound,
  Electronics: Smartphone,
  Wallets: Wallet,
  Documents: FileText,
  Clothing: Shirt,
  Other: Package,
};
export default function ItemCard({ item }) {
  const Icon = icons[item.category] || Package;
  return (
    <article className="item-card h-100">
      <div className={`item-visual category-${item.category.toLowerCase()}`}>
        {item.image_data ? (
          <img src={item.image_data} alt={item.title} loading="lazy" />
        ) : (
          <Icon size={54} strokeWidth={1.25} aria-hidden="true" />
        )}
        <StatusBadge status={item.status} />
      </div>
      <div className="p-4">
        <div className="item-meta">
          {item.category} <span>·</span> {String(item.event_date).slice(0, 10)}
        </div>
        <h3>
          <Link to={`/items/${item.id}`}>
            {item.title}
            <ArrowUpRight size={19} aria-hidden="true" />
          </Link>
        </h3>
        <p className="location">
          <MapPin size={15} aria-hidden="true" />
          {item.location}
        </p>
        {item.is_sample && <span className="sample-label">Sample item</span>}
      </div>
    </article>
  );
}

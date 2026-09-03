import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, ArrowRight, SlidersHorizontal } from "lucide-react";
import { api } from "../services/api";
import ItemCard from "../components/ItemCard";
import Feedback from "../components/Feedback";
import EmptyState from "../components/EmptyState";
import WeatherCard from "../components/WeatherCard";
import { categories } from "../data/categories";
export default function FoundItems() {
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState(params.get("q") || "");
  const [data, setData] = useState({ items: [], total: 0, pages: 1, page: 1 });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [retry, setRetry] = useState(0);
  const query = params.toString();
  useEffect(() => {
    setSearch(params.get("q") || "");
  }, [params]);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    api(`/items?${query}`)
      .then((value) => {
        if (active) setData(value);
      })
      .catch((err) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [query, retry]);
  function filter(name, value) {
    const next = new URLSearchParams(params);
    if (value) next.set(name, value);
    else next.delete(name);
    next.delete("page");
    setParams(next);
  }
  return (
    <>
      <div className="page-intro">
        <div>
          <span className="eyebrow">FOUNDIT - KING HUSSEIN BUSINESS PARK</span>
          <h1>
            Lost something?
            <br />
            <span>Let’s find it.</span>
          </h1>
          <p>
            Browse belongings found across the park and on its transport.
            <br className="d-none d-md-block" /> See a match? Tell us what makes
            it yours.
          </p>
        </div>
        <Link className="report-callout" to="/report">
          <span>Not here yet?</span>
          <strong>Report a lost item</strong>
          <span>
            Leave the details. Keep track of your report.{" "}
            <ArrowRight size={20} />
          </span>
        </Link>
      </div>
      <section className="search-panel" aria-label="Search found items">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            filter("q", search);
          }}
        >
          <Search size={22} aria-hidden="true" />
          <label htmlFor="search" className="visually-hidden">
            Search item or location
          </label>
          <input
            id="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search an item or park location…"
            maxLength={100}
          />
          <button className="btn btn-primary">Search items</button>
        </form>
        <div className="category-list" aria-label="Filter by category">
          <SlidersHorizontal size={17} aria-hidden="true" />
          {["All items", ...categories].map((category) => (
            <button
              key={category}
              onClick={() =>
                filter("category", category === "All items" ? "" : category)
              }
              aria-pressed={
                (params.get("category") || "All items") === category
              }
              className={
                (params.get("category") || "All items") === category
                  ? "category active"
                  : "category"
              }
            >
              {category}
            </button>
          ))}
        </div>
      </section>
      <div className="results-heading">
        <div>
          <h2>Found items</h2>
          <p>
            {loading
              ? "Checking the latest reports…"
              : error
                ? "Please try loading the items again."
                : `${data.total} ${data.total === 1 ? "item" : "items"} across park locations`}
          </p>
        </div>
        <span className="verification-note">
          Every claim is reviewed by an employee
        </span>
      </div>
      <Feedback error={error} loading={loading} />
      {error && (
        <button
          className="btn btn-outline-primary mb-4"
          onClick={() => setRetry(retry + 1)}
        >
          Try again
        </button>
      )}
      {!loading && !error && (
        <>
          {data.items.length ? (
            <div className="row g-4">
              {data.items.map((item) => (
                <div className="col-12 col-sm-6 col-lg-4" key={item.id}>
                  <ItemCard item={item} />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="No matching items">
              Try another item name or location, or report what you lost.
            </EmptyState>
          )}
          {data.pages > 1 && (
            <nav className="pagination-controls" aria-label="Results pages">
              <button
                className="btn btn-outline-primary"
                disabled={data.page === 1}
                onClick={() =>
                  setParams({
                    ...Object.fromEntries(params),
                    page: String(data.page - 1),
                  })
                }
              >
                Previous
              </button>
              <span>
                Page {data.page} of {data.pages}
              </span>
              <button
                className="btn btn-outline-primary"
                disabled={data.page === data.pages}
                onClick={() =>
                  setParams({
                    ...Object.fromEntries(params),
                    page: String(data.page + 1),
                  })
                }
              >
                Next
              </button>
            </nav>
          )}
        </>
      )}
      <div className="bottom-notes">
        <p>
          <strong>A small detail can make a big difference.</strong>
          <br />
          Keep serial numbers, ID numbers and private details for your ownership
          claim.
        </p>
        <WeatherCard />
      </div>
    </>
  );
}

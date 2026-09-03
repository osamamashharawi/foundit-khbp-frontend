import { useState } from "react";
import Field from "./Field";
import Feedback from "./Feedback";
import { categories } from "../data/categories";
export default function ItemForm({ initial, onSave, kind = "lost" }) {
  const [form, setForm] = useState(
    initial
      ? { ...initial, event_date: String(initial.event_date).slice(0, 10) }
      : {
          title: "",
          description: "",
          category: "Other",
          event_date: new Date().toISOString().slice(0, 10),
          location: "",
          route: "",
          image_data: null,
        },
  );
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [reading, setReading] = useState(false);
  function change(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }
  function upload(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (
      !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
      file.size > 1024 * 1024
    ) {
      setError("Choose a JPG, PNG or WebP image under 1 MB.");
      e.target.value = "";
      return;
    }
    setError("");
    setReading(true);
    const reader = new FileReader();
    reader.onload = () => {
      setForm((previous) => ({ ...previous, image_data: reader.result }));
      setReading(false);
    };
    reader.onerror = () => {
      setError("Could not read the image.");
      setReading(false);
    };
    reader.readAsDataURL(file);
  }
  async function submit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await onSave({ ...form, kind });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <form onSubmit={submit}>
      <Feedback error={error} />
      <div className="row">
        <div className="col-md-8">
          <Field
            label="Item name"
            name="title"
            value={form.title}
            onChange={change}
            required
            minLength={3}
            maxLength={100}
          />
        </div>
        <div className="col-md-4">
          <label className="form-label" htmlFor="category">
            Category
          </label>
          <select
            id="category"
            name="category"
            className="form-select mb-3"
            value={form.category}
            onChange={change}
          >
            {categories.map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </div>
      </div>
      <Field
        multiline
        label="Description"
        name="description"
        value={form.description}
        onChange={change}
        required
        minLength={10}
        maxLength={2000}
      />
      <p className="small text-secondary">
        For found items, keep unique identifying details private so the owner
        can prove ownership.
      </p>
      <div className="row">
        <div className="col-md-6">
          <Field
            label={kind === "lost" ? "Date lost" : "Date found"}
            name="event_date"
            type="date"
            value={form.event_date}
            onChange={change}
            required
            max={new Date().toISOString().slice(0, 10)}
          />
        </div>
        <div className="col-md-6">
          <Field
            label="Route or bus number (optional)"
            name="route"
            value={form.route}
            onChange={change}
            maxLength={60}
          />
        </div>
      </div>
      <Field
        label="Building, reception, station or location"
        name="location"
        value={form.location}
        onChange={change}
        required
        minLength={2}
        maxLength={160}
      />
      <Field
        label="Photo (optional, JPG/PNG/WebP, up to 1 MB)"
        name="photo"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={upload}
      />
      {form.image_data && (
        <div className="upload-preview">
          <img src={form.image_data} alt="Selected item" />
          <button
            type="button"
            className="btn btn-sm btn-outline-danger"
            onClick={() => setForm({ ...form, image_data: null })}
          >
            Remove photo
          </button>
        </div>
      )}
      <button className="btn btn-primary mt-3" disabled={busy || reading}>
        {busy
          ? "Saving…"
          : initial
            ? "Save changes"
            : kind === "lost"
              ? "Submit lost report"
              : "Register found item"}
      </button>
    </form>
  );
}

export default function Field({ label, name, multiline = false, ...props }) {
  return (
    <div className="mb-3">
      <label htmlFor={name} className="form-label">
        {label}
      </label>
      {multiline ? (
        <textarea
          id={name}
          name={name}
          className="form-control"
          rows="4"
          {...props}
        />
      ) : (
        <input id={name} name={name} className="form-control" {...props} />
      )}
    </div>
  );
}

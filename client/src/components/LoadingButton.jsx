export default function LoadingButton({ loading, children, className = "btn btn-primary", ...props }) {
  return (
    <button className={className} disabled={loading || props.disabled} {...props}>
      {loading && <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />}
      {children}
    </button>
  );
}

// src/components/LoadingSpinner.jsx
export function LoadingSpinner() {
  return (
    <div className="spinner" role="status" aria-live="polite">
      <div className="spinner-circle"></div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}

import type { ApiError } from "@/types";

interface ErrorMessageProps {
  error: ApiError;
  onRetry?: () => void;
}

export function ErrorMessage({ error, onRetry }: ErrorMessageProps) {
  const isAuthError = error.status === 401 || error.status === 403;

  return (
    <div className="error-message" role="alert" data-testid="error-message">
      <p style={{ fontSize: "1.5rem", margin: "0 0 0.5rem" }}>⚠️</p>
      <p style={{ fontWeight: 600 }}>{isAuthError ? "Invalid API Key" : "Something went wrong"}</p>
      <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem", margin: "0.25rem 0" }}>
        {isAuthError
          ? "Please check your VITE_PEXELS_API_KEY in .env.local"
          : error.message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            marginTop: "0.75rem",
            padding: "0.4rem 1rem",
            border: "1px solid var(--color-border)",
            borderRadius: "6px",
            background: "var(--color-surface)",
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          Try again
        </button>
      )}
    </div>
  );
}

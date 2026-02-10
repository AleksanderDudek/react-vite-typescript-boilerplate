// ============================================================
// Environment & Configuration
// ============================================================
// Centralizes access to environment variables with validation.
// All env vars accessed via import.meta.env must be prefixed
// with VITE_ to be exposed to client-side code.
//
// SECURITY NOTE:
// - VITE_ prefixed vars are embedded in the build and visible
//   in the browser. NEVER put true secrets here.
// - For API keys that must be secret, use a backend proxy.
// - The Pexels API key is exposed client-side because Pexels
//   allows client-side usage. For other APIs, always proxy.
// ============================================================

interface AppConfig {
  pexelsApiKey: string;
  appTitle: string;
  apiBaseUrl: string;
  isDevelopment: boolean;
  isProduction: boolean;
  isTest: boolean;
}

function getEnvVar(key: string, fallback?: string): string {
  const value = import.meta.env[key] as string | undefined;
  if (!value && fallback === undefined) {
    throw new Error(
      `Missing required environment variable: ${key}. ` +
        `Check your .env.local file. See .env.example for reference.`,
    );
  }
  return value || fallback || "";
}

export const config: AppConfig = {
  pexelsApiKey: getEnvVar("VITE_PEXELS_API_KEY", ""),
  appTitle: getEnvVar("VITE_APP_TITLE", "Pexels Explorer"),
  apiBaseUrl: getEnvVar("VITE_API_BASE_URL", "https://api.pexels.com"),
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  isTest: import.meta.env.MODE === "test",
};

export function validateConfig(): void {
  if (!config.pexelsApiKey) {
    console.warn(
      "⚠️  VITE_PEXELS_API_KEY is not set. API calls will fail.\n" +
        "   Get your free key at: https://www.pexels.com/api/\n" +
        "   Then add it to .env.local",
    );
  }
}

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { toApiError } from "@/api/pexels";

// We test the error helper directly, and mock fetch for API calls.
// For full integration tests with MSW, see the hooks tests.

describe("toApiError", () => {
  it("converts a standard Error to ApiError", () => {
    const error = new Error("Something failed");
    const result = toApiError(error);

    expect(result).toEqual({ message: "Something failed" });
  });

  it("converts an unknown value to a generic ApiError", () => {
    const result = toApiError("string error");

    expect(result).toEqual({ message: "An unexpected error occurred" });
  });

  it("converts null/undefined to generic ApiError", () => {
    expect(toApiError(null)).toEqual({ message: "An unexpected error occurred" });
    expect(toApiError(undefined)).toEqual({ message: "An unexpected error occurred" });
  });
});

describe("pexelsFetch (via searchPhotos)", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.stubEnv("VITE_PEXELS_API_KEY", "test-key");
    vi.stubEnv("VITE_API_BASE_URL", "https://api.pexels.com");
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.unstubAllEnvs();
  });

  it("includes Authorization header with API key", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ photos: [], total_results: 0, page: 1, per_page: 15 }),
    });
    globalThis.fetch = mockFetch;

    // Dynamic import to pick up stubbed env
    const { searchPhotos } = await import("@/api/pexels");
    await searchPhotos({ query: "test", page: 1, per_page: 15 });

    expect(mockFetch).toHaveBeenCalled();
    const [, options] = mockFetch.mock.calls[0]!;
    expect(options.headers.Authorization).toBeTruthy();
  });
});

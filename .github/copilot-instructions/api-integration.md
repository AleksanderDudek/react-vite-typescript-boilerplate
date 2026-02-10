# API Integration Best Practices

## Architecture

This project uses a thin API client layer in `src/api/` that wraps `fetch`.
Each external service gets its own module (e.g., `pexels.ts`).

```
src/api/
  pexels.ts    → Pexels API client (typed fetch wrappers)
  index.ts     → Barrel exports
```

## API Client Design

### 1. Centralized Base Fetch

Create a typed helper that handles auth, base URL, and error mapping:

```typescript
async function pexelsFetch<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(`${config.apiBaseUrl}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value) url.searchParams.set(key, value);
    });
  }

  const response = await fetch(url.toString(), {
    headers: { Authorization: config.pexelsApiKey },
  });

  if (!response.ok) {
    throw new PexelsApiError(`API error (${response.status})`, response.status);
  }
  return response.json() as Promise<T>;
}
```

### 2. Typed Endpoint Functions

Each endpoint gets a dedicated function with typed params and response:

```typescript
export async function searchPhotos(params: SearchParams): Promise<PexelsPhotoResponse> {
  return pexelsFetch<PexelsPhotoResponse>("/v1/search", {
    query: params.query,
    page: String(params.page),
    per_page: String(params.per_page),
  });
}
```

### 3. Error Handling

- Create custom error classes with status codes.
- Provide a `toApiError()` helper for UI consumption.
- Never expose raw fetch errors to components.

```typescript
class PexelsApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "PexelsApiError";
    this.status = status;
  }
}
```

## Consuming APIs in React

### Pattern: Custom Hook

Wrap API calls in hooks that manage loading/error/data state:

```typescript
export function usePexelsSearch() {
  const [data, setData] = useState<PexelsPhoto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const search = useCallback(async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await searchPhotos({ query, page: 1, per_page: 15 });
      setData(result.photos);
    } catch (err) {
      setError(toApiError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, search };
}
```

## Security & Secrets

### Client-Side API Keys

- Vite exposes `VITE_` prefixed env vars to the browser bundle.
- The Pexels API key IS exposed client-side — Pexels permits this.
- For APIs that require secret keys, **always use a backend proxy**.

### Backend Proxy Pattern (when needed)

```
Browser → Your Backend → External API
                 ↑
           Secret key lives here only
```

### Never Do This

```typescript
// ❌ NEVER hardcode secrets
const API_KEY = "sk-abc123";

// ❌ NEVER commit .env.local
// .gitignore must include .env.local and .env.*.local
```

## Request Best Practices

- Add `AbortController` for cancellable requests (search-as-you-type).
- Implement pagination with "load more" or infinite scroll.
- Debounce user input before making API calls.
- Cache responses when appropriate (consider `stale-while-revalidate`).
- Set reasonable timeouts.
- Log errors in development, suppress in production.

## Rate Limiting

Pexels API has a default limit of 200 requests/hour. Handle 429 responses gracefully:

```typescript
if (response.status === 429) {
  throw new PexelsApiError("Rate limit exceeded. Please try again later.", 429);
}
```

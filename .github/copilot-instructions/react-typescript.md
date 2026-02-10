# React & TypeScript Best Practices

## TypeScript

- Enable `strict` mode. Never use `any` — use `unknown` + type guards instead.
- Use `type` for object shapes and unions; `interface` only for extendable contracts.
- Use `as const` for literal tuples and config objects.
- Prefer `Record<string, T>` over index signatures.
- Use discriminated unions for state machines.
- Always type function parameters and return types for public APIs.
- Use `import type` for type-only imports (enables tree-shaking).

```typescript
// ✅ Good
import type { PexelsPhoto } from "@/types";

type Status = "idle" | "loading" | "success" | "error";

interface ComponentProps {
  photos: PexelsPhoto[];
  onSelect: (id: number) => void;
}

// ❌ Bad
import { PexelsPhoto } from "@/types";
const data: any = fetchData();
```

## React Components

- Functional components only. No class components.
- Destructure props in function signature.
- Keep components under 150 lines — extract logic into custom hooks.
- Use `children` for composition over configuration.
- Prefer controlled components for forms.

```tsx
// ✅ Good — small, typed, single-responsibility
interface PhotoCardProps {
  photo: PexelsPhoto;
  onClick: (id: number) => void;
}

export function PhotoCard({ photo, onClick }: PhotoCardProps) {
  return (
    <button onClick={() => onClick(photo.id)}>
      <img src={photo.src.medium} alt={photo.alt} loading="lazy" />
      <span>{photo.photographer}</span>
    </button>
  );
}
```

## Hooks

- Prefix with `use`. One hook per file.
- Return objects (not arrays) for hooks with 3+ return values.
- Use `useCallback` for functions passed to children or used as effect dependencies.
- Use `useMemo` only for expensive computations — don't premature-optimize.
- Never call hooks conditionally.

```typescript
// ✅ Good — returns object, memoized callback
export function usePexelsSearch() {
  const [photos, setPhotos] = useState<PexelsPhoto[]>([]);
  const [loading, setLoading] = useState(false);

  const search = useCallback(async (query: string) => {
    setLoading(true);
    // ...
  }, []);

  return { photos, loading, search };
}
```

## State Management

- Start with local state (`useState`). Lift state only when needed.
- Use `useReducer` for complex state with multiple sub-values.
- Use Context for truly global state (theme, auth, config).
- Avoid putting server/API state in React state — use the fetch-in-hook pattern or a library like TanStack Query.

## Performance

- Use `React.lazy()` + `Suspense` for code splitting routes.
- Add `loading="lazy"` to images below the fold.
- Use `key` prop correctly — stable, unique identifiers (not array index).
- Avoid creating objects/arrays inline in JSX when passed as props.

## Error Handling

- Use Error Boundaries for UI crash recovery.
- Handle API errors gracefully with user-friendly messages.
- Type your errors — don't catch `any`.

```typescript
// ✅ Typed error handling
try {
  const data = await searchPhotos(params);
  return data;
} catch (error: unknown) {
  if (error instanceof PexelsApiError) {
    return { message: error.message, status: error.status };
  }
  return { message: "An unexpected error occurred" };
}
```

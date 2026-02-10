# Testing Best Practices

## Framework: Vitest + React Testing Library

This project uses Vitest (Vite-native test runner) with React Testing Library
for component testing and jsdom for browser environment simulation.

## Test Structure

```
src/__tests__/
  components/   → Component tests
  hooks/        → Hook tests
  pages/        → Page integration tests
  utils/        → Utility function tests
  fixtures.ts   → Shared mock data
```

## Naming Conventions

- File: `ComponentName.test.tsx` or `utilName.test.ts`
- Describe block: the module/component name
- It block: starts with a verb — "renders", "calls", "returns", "throws"

```typescript
describe("SearchBar", () => {
  it("renders the search input and submit button", () => { /* ... */ });
  it("calls onSearch with query on submit", async () => { /* ... */ });
  it("disables submit when loading", () => { /* ... */ });
});
```

## Testing Philosophy

1. **Test behavior, not implementation.** Assert what the user sees, not internal state.
2. **Query by role/label first.** Use `getByRole`, `getByLabelText`, `getByText` — avoid `getByTestId` unless necessary.
3. **Use userEvent over fireEvent.** `userEvent` simulates real browser interactions.
4. **One assertion focus per test.** Multiple `expect`s are fine if they test the same behavior.
5. **Don't test library code.** Don't test that React renders or that fetch works.

## Component Test Pattern

```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MyComponent } from "@/components/MyComponent";

describe("MyComponent", () => {
  // Define default/reusable props
  const defaultProps = {
    onSubmit: vi.fn(),
    loading: false,
  };

  it("renders correctly with default props", () => {
    render(<MyComponent {...defaultProps} />);
    expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
  });

  it("calls onSubmit when form is submitted", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<MyComponent {...defaultProps} onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText("Name"), "Jane");
    await user.click(screen.getByRole("button", { name: "Submit" }));

    expect(onSubmit).toHaveBeenCalledWith("Jane");
  });
});
```

## Hook Test Pattern

```typescript
import { renderHook, act } from "@testing-library/react";
import { useCounter } from "@/hooks/useCounter";

describe("useCounter", () => {
  it("increments the count", () => {
    const { result } = renderHook(() => useCounter());

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });
});
```

## API / Async Test Pattern

Use MSW (Mock Service Worker) for mocking HTTP requests in tests.
Alternatively, mock at the module level with `vi.mock()`.

```typescript
import { vi } from "vitest";

// Module-level mock
vi.mock("@/api/pexels", () => ({
  searchPhotos: vi.fn().mockResolvedValue({
    photos: [mockPhoto],
    total_results: 1,
    page: 1,
    per_page: 15,
  }),
}));
```

## What to Test

| Component type    | What to test                                    |
| ----------------- | ----------------------------------------------- |
| UI component      | Renders correctly, responds to user interaction |
| Form component    | Validation, submission, error states            |
| List/Grid         | Empty state, populated state, item rendering    |
| Hook              | Return values, state transitions, side effects  |
| Utility function  | Input/output pairs, edge cases, error handling  |
| API client        | Request format, error mapping, response parsing |

## What NOT to Test

- Implementation details (internal state, private methods)
- Third-party library behavior
- Styling / CSS classes (unless behavior-dependent)
- Exact snapshot matches (they break too easily)

## Coverage

Vitest is configured with 70% threshold for branches, functions, lines, and statements. Run `npm run test:coverage` to check. The coverage report is generated in `coverage/` and consumed by SonarQube.

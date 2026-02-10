# Web Development Best Practices

## HTML & Accessibility

- Use semantic HTML elements (`<main>`, `<nav>`, `<article>`, `<section>`, `<button>`).
- Every `<img>` must have a meaningful `alt` attribute.
- Interactive elements must be keyboard accessible.
- Use ARIA attributes only when semantic HTML isn't sufficient.
- Color contrast must meet WCAG AA (4.5:1 for text, 3:1 for large text).
- Forms must have associated `<label>` elements.
- Use `role="alert"` for error messages that appear dynamically.

```tsx
// ✅ Good — semantic, accessible
<button onClick={onSearch} disabled={loading} aria-label="Search photos">
  {loading ? "Searching..." : "Search"}
</button>

// ❌ Bad — div as button, no keyboard support
<div onClick={onSearch} className="button">Search</div>
```

## CSS

- Use **CSS custom properties** (variables) for design tokens (colors, spacing, fonts).
- Use **mobile-first responsive design** with `min-width` media queries.
- Prefer `rem`/`em` over `px` for sizing.
- Use `clamp()` for fluid typography.
- Use CSS Grid for 2D layouts, Flexbox for 1D layouts.
- Co-locate component CSS with the component file.
- Use BEM-like naming: `.component__element--modifier`.

```css
:root {
  --color-accent: #6c5ce7;
  --font-body: "DM Sans", system-ui, sans-serif;
}

.photo-grid {
  columns: 3;
  column-gap: 1rem;
}

@media (max-width: 900px) {
  .photo-grid { columns: 2; }
}
```

## Performance

- **Images:** Use `loading="lazy"`, serve responsive sizes (`srcset`), use modern formats (WebP/AVIF).
- **Code splitting:** Use `React.lazy()` for route-level components.
- **Bundle size:** Avoid large dependencies. Check with `npm run build` and review output.
- **Fonts:** Use `font-display: swap` and preload critical fonts.
- **Caching:** Set long cache headers for hashed static assets (Vite does this automatically).

## Security

- Always use `rel="noopener noreferrer"` with `target="_blank"` links.
- Sanitize user input before rendering (React does this by default).
- Never use `dangerouslySetInnerHTML` with untrusted content.
- Use Content Security Policy headers in production (configured in nginx).
- Store secrets in environment variables, never in code.
- Validate all API responses before using them.

## Environment Variables

Vite uses a specific convention for env vars:

| File              | Purpose                          | Committed? |
| ----------------- | -------------------------------- | ---------- |
| `.env`            | Defaults for all environments    | Yes        |
| `.env.local`      | Local overrides (secrets go here)| **No**     |
| `.env.development`| Dev-only non-secret defaults     | Yes        |
| `.env.production` | Prod-only non-secret defaults    | Yes        |
| `.env.test`       | Test-only defaults               | Yes        |

**Load order** (later overrides earlier):
`.env` → `.env.local` → `.env.[mode]` → `.env.[mode].local`

Only variables prefixed with `VITE_` are exposed to client-side code.

## Git Workflow

- Write descriptive commit messages (imperative mood): "Add photo grid component"
- Keep PRs small and focused — one feature or fix per PR.
- Husky pre-commit runs lint-staged; pre-push runs type-check and tests.
- All CI checks must pass before merging.

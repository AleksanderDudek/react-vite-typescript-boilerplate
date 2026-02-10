# GitHub Copilot Instructions

This project is a React + TypeScript frontend application using Vite, with
Pexels API integration. Follow these guidelines when generating code.

## Architecture & Project Structure

```
src/
  api/          → API client modules (one per external service)
  components/   → Reusable UI components (with co-located CSS)
  hooks/        → Custom React hooks
  pages/        → Page-level components (route entries)
  types/        → TypeScript type definitions
  utils/        → Pure utility functions and configuration
  styles/       → Global styles and design tokens
  __tests__/    → Test files mirroring src/ structure
```

## Key Conventions

- Use **functional components** exclusively — no class components.
- Use **named exports** for components, hooks, and utilities.
- Use **default exports** only for page components and App.
- Use **barrel exports** (index.ts) for each directory.
- Prefix custom hooks with `use` (e.g., `usePexelsSearch`).
- Co-locate CSS files with their components.
- Use **CSS custom properties** (design tokens) from `styles/global.css`.

## For detailed instructions, see:

- [React & TypeScript](./react-typescript.md)
- [Testing](./testing.md)
- [API Integration](./api-integration.md)
- [Web Development](./web-development.md)

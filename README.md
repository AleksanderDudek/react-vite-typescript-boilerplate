# React Pexels Explorer — Frontend Boilerplate

A production-ready React + TypeScript boilerplate featuring Vite, Vitest, Docker,
SonarQube, GitHub Actions CI/CD, Husky git hooks, and a working demo app that
searches photos and videos via the [Pexels API](https://www.pexels.com/api/).

---

## What's Included

| Category | Tool / Config |
|---|---|
| **Framework** | React 19 + TypeScript (strict mode) |
| **Build** | Vite 6 with path aliases (`@/`) |
| **Linter** | ESLint 9 (flat config) + Prettier |
| **Tests** | Vitest + React Testing Library + coverage thresholds |
| **Docker** | Multi-stage production build + dev hot-reload |
| **CI/CD** | GitHub Actions (lint → test → build → SonarQube → Docker) |
| **Code Quality** | SonarQube Cloud (free tier, up to 50k LOC private) |
| **Git Hooks** | Husky pre-commit (lint-staged) + pre-push (type-check + tests) |
| **Copilot** | Coding guidelines for React, TypeScript, testing, APIs, web dev |
| **Env Management** | Multi-environment `.env` files with typed `ImportMetaEnv` |

---

## Quick Start

### Prerequisites

- Node.js 22+ and npm
- (Optional) Docker & Docker Compose
- A free [Pexels API key](https://www.pexels.com/api/)

### 1. Clone & Install

```bash
git clone https://github.com/your-org/react-pexels-explorer.git
cd react-pexels-explorer
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Pexels API key:

```
VITE_PEXELS_API_KEY=your_actual_api_key_here
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Type-check + production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Auto-fix lint errors |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check formatting without changes |
| `npm run test` | Run tests once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run test:ui` | Open Vitest UI |
| `npm run type-check` | TypeScript type checking |
| `npm run validate` | Run all checks (type-check + lint + test) |
| `npm run docker:build` | Build Docker image |
| `npm run docker:run` | Run Docker container on port 3000 |
| `npm run docker:compose` | Start with Docker Compose |

---

## Environment Variables

This project uses Vite's built-in env variable system. Variables must be
prefixed with `VITE_` to be available in browser code.

### File Hierarchy

| File | Purpose | Git |
|---|---|---|
| `.env.example` | Template with documentation | ✅ Committed |
| `.env.local` | **Your local secrets** | ❌ Gitignored |
| `.env.development` | Dev defaults (non-secret) | ✅ Committed |
| `.env.production` | Prod defaults (non-secret) | ✅ Committed |
| `.env.test` | Test defaults | ✅ Committed |

Vite loads files in order, with later files overriding earlier ones:
`.env` → `.env.local` → `.env.[mode]` → `.env.[mode].local`

### Type Safety

Environment variables are typed in `vite-env.d.ts`:

```typescript
interface ImportMetaEnv {
  readonly VITE_PEXELS_API_KEY: string;
  readonly VITE_APP_TITLE: string;
  readonly VITE_API_BASE_URL: string;
}
```

Accessed via `import.meta.env.VITE_PEXELS_API_KEY` or through the centralized
`config` object in `src/utils/config.ts`.

---

## Managing Secrets

### Local Development

Secrets go in `.env.local` (gitignored). Never commit API keys.

### CI/CD (GitHub Actions)

1. Go to your repo → **Settings** → **Secrets and variables** → **Actions**
2. Add secrets:
   - `VITE_PEXELS_API_KEY` — your Pexels API key
   - `SONAR_TOKEN` — SonarQube Cloud token (optional)

The pipeline injects these at build time:

```yaml
- name: Build
  run: npm run build
  env:
    VITE_PEXELS_API_KEY: ${{ secrets.VITE_PEXELS_API_KEY }}
```

### Docker

Pass secrets as build args (never bake them into images pushed to registries):

```bash
docker build --build-arg VITE_PEXELS_API_KEY=your_key .
```

Or with Docker Compose, set the variable in your shell or `.env.local`:

```bash
VITE_PEXELS_API_KEY=your_key docker compose up app
```

### Important Security Notes

- `VITE_` prefixed variables are **embedded in the JavaScript bundle** and visible
  in the browser. The Pexels API permits client-side usage, so this is acceptable.
- For APIs requiring secret keys, use a **backend proxy** — the secret key lives
  on your server, never in the browser bundle.
- Rotate keys immediately if accidentally committed.

---

## Docker

### Production Build

```bash
# Build
docker build -t react-pexels-explorer \
  --build-arg VITE_PEXELS_API_KEY=your_key .

# Run
docker run -p 3000:80 react-pexels-explorer
```

The production image uses a multi-stage build (Node for building, nginx for serving)
with security headers, gzip compression, and SPA routing configured.

### Development with Hot Reload

```bash
docker compose up dev
```

This mounts your source code into the container for live editing.

---

## Testing

Tests live in `src/__tests__/` mirroring the source structure. We use:

- **Vitest** — Vite-native test runner (fast, ESM-first)
- **React Testing Library** — Test components by behavior, not implementation
- **userEvent** — Simulate real user interactions
- **MSW** — Mock HTTP requests (available, configured for API tests)

### Running Tests

```bash
npm run test              # Single run
npm run test:watch        # Watch mode
npm run test:coverage     # With coverage report
npm run test:ui           # Visual UI
```

### Coverage Thresholds

Configured in `vite.config.ts` — builds will fail if coverage drops below 70%
for branches, functions, lines, or statements.

---

## SonarQube

### Free Tier Options

**SonarQube Cloud** (recommended for GitHub projects):
- Free for all public repos (unlimited)
- Free for private repos up to 50k lines of code
- Sign up at [sonarcloud.io](https://sonarcloud.io)

**SonarQube Community Build** (self-hosted):
- Free and open source
- Download from [sonarsource.com](https://www.sonarsource.com/open-source-editions/)

### Setup

1. Create an account at [sonarcloud.io](https://sonarcloud.io)
2. Import your GitHub repository
3. Update `sonar-project.properties` with your org and project key
4. Add `SONAR_TOKEN` as a GitHub Actions secret
5. Push to main — the CI pipeline will run the analysis automatically

---

## CI/CD Pipeline (GitHub Actions)

GitHub Actions is **free for public repos** and includes 2,000 minutes/month
for private repos on the free plan.

### Pipeline Stages

```
Push/PR to main
  ├── quality (lint + type-check + test with coverage)
  ├── build (depends on quality)
  ├── sonar (depends on quality, main branch only)
  └── docker (depends on build, main branch only)
```

### Pipeline File

Located at `.github/workflows/ci.yml`. It uses:
- Dependency caching (`actions/setup-node` with npm cache)
- Concurrency control (cancels in-progress runs for same branch)
- Artifact upload (coverage report, build output)
- Conditional jobs (Docker/Sonar only on main push)

---

## Git Hooks (Husky)

### Pre-commit

Runs `lint-staged` on staged files:
- `.ts`, `.tsx` → ESLint fix + Prettier
- `.css`, `.json`, `.md` → Prettier

### Pre-push

Runs before every `git push`:
1. TypeScript type-check (`tsc --noEmit`)
2. Full test suite (`vitest run`)

If either fails, the push is blocked.

---

## Copilot Instructions

The `.github/copilot-instructions/` directory contains coding guidelines
that GitHub Copilot uses to generate better suggestions for this project:

| File | Topics |
|---|---|
| `index.md` | Project structure and conventions |
| `react-typescript.md` | React patterns, TypeScript usage, hooks, state |
| `testing.md` | Vitest, RTL, test structure, what to test |
| `api-integration.md` | API client design, error handling, security |
| `web-development.md` | HTML, CSS, accessibility, performance, env vars |

---

## Project Structure

```
├── .github/
│   ├── copilot-instructions/  → Copilot coding guidelines
│   └── workflows/ci.yml       → GitHub Actions pipeline
├── .husky/
│   ├── pre-commit             → Lint staged files
│   └── pre-push               → Type-check + tests
├── .vscode/                   → Editor settings + extensions
├── docker/
│   ├── Dockerfile.dev         → Dev container with HMR
│   └── nginx.conf             → Production nginx config
├── public/                    → Static assets
├── src/
│   ├── __tests__/             → All test files
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── utils/
│   │   └── fixtures.ts        → Shared mock data
│   ├── api/                   → API client modules
│   ├── components/            → Reusable UI components
│   ├── hooks/                 → Custom React hooks
│   ├── pages/                 → Page components
│   ├── styles/                → Global styles
│   ├── types/                 → TypeScript types
│   ├── utils/                 → Utilities and config
│   ├── App.tsx
│   ├── main.tsx
│   └── test-setup.ts
├── .env.example               → Env var template
├── .env.development           → Dev defaults
├── .env.production            → Prod defaults
├── .env.test                  → Test defaults
├── .prettierrc                → Prettier config
├── docker-compose.yml
├── Dockerfile                 → Production multi-stage build
├── eslint.config.js           → ESLint flat config
├── sonar-project.properties   → SonarQube config
├── tsconfig.json
└── vite.config.ts             → Vite + Vitest config
```

---

## License

MIT

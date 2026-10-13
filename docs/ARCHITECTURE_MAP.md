# Auralcraftverse Architecture Map

This is a source-tree orientation guide based on the repository's current structure. It is intentionally descriptive, not a proposal to restructure the application.

## Application entry and core UI

| Path | Current responsibility / preservation note |
|---|---|
| `src/main.tsx` | React application entry point. Keep bootstrapping changes minimal and review them carefully. |
| `src/App.tsx` | Main application surface, content, navigation, guide rendering, and tool gateway routes. This is a large, high-impact file; isolate changes and inspect its diff closely. |
| `src/EntryExperience.tsx` | Entry/arrival experience and its launch animation UI. Changes here should be validated separately from the main app. |
| `src/index.css` | Global and component styling. It is large and affects many screens; prefer scoped selectors and verify desktop and mobile behavior. |
| `src/lib/supabase.ts` | Supabase client integration module. Treat configuration and authentication-related changes as separately scoped work; do not add credentials to source. |

## Build and deployment configuration

| Path | Current responsibility / preservation note |
|---|---|
| `package.json` | Dependency ranges and npm scripts. Changes affect local development, CI, and hosting builds. |
| `vite.config.ts` | Vite configuration, React plugin, relative asset base, output directory, and source-map behavior. Preserve the `APPDEPLOY_VITE_OUT_DIR` and `APPDEPLOY_VITE_SOURCEMAP` conventions unless a deliberate migration is approved. |
| `tsconfig.json` | TypeScript compiler configuration. It is strict, but the current package scripts do not expose a dedicated type-check command. |
| `.github/workflows/build.yml` | GitHub Actions production build workflow. It runs on pushes and pull requests targeting `main`, installs dependencies, builds, and uploads `dist/` as a 14-day artifact. |
| `render.yaml` | Static-site hosting configuration. It builds to `dist`, publishes that directory, enables automatic deployment on commit, and defines SPA rewrite routes for tools and guides. |
| `tests/tests.json` | Existing test-related JSON asset. Confirm its intended consumer before assuming it is an executable automated test suite. |

## Current integrity observations

- The repository currently has no root `package-lock.json`. Dependency installation is therefore not locked by a committed npm lockfile.
- The current `package.json` scripts include `dev`, `build`, and `preview`; there is no dedicated `typecheck` or `test` script at present.
- The build workflow uses `npm install --no-audit --no-fund`, and `render.yaml` uses `npm install && npm run build`.
- The Vite build currently disables source maps by default. Hidden source maps are enabled only when `APPDEPLOY_VITE_SOURCEMAP=hidden`.
- The application has tool and guide SPA rewrites. Route or hosting changes must be checked together because either layer can affect direct navigation.

These observations are a point-in-time inventory, not proof of production runtime behavior or repository branch protection.

## Change-risk guide

- **High impact:** `src/App.tsx`, `src/index.css`, `vite.config.ts`, `render.yaml`, `package.json`, `.github/workflows/build.yml`.
- **Sensitive integration:** `src/lib/supabase.ts` and any environment or authentication configuration.
- **Focused UI area:** `src/EntryExperience.tsx`.

Before changing a high-impact path, document the intent, expected user-visible effect, affected routes, validation performed, and rollback path. Avoid unrelated refactoring in the same change.


## Repository protection status checked on 2026-10-13

The GitHub API currently reports:

- The `main` branch is listed as `protected: false`.
- The repository rulesets endpoint returned an empty list.
- Therefore, no active branch protection rule or ruleset was visible through the accessible repository API at the time of this check.
- The preservation branch and pull request checks do not themselves protect `main`.

**Recommended owner action:** In GitHub, open **Settings → Rules → Rulesets** (or **Settings → Branches** for classic protection) and configure protection for `main`: require a pull request, require the build check, block force pushes and deletion, and limit bypass permissions. Confirm the actual saved settings in GitHub afterward. Do not enable a rule that requires an unverified check name; first confirm the exact check reported by Actions.

This is a repository-settings follow-up, not an application-code change. The connected integration has not been used to modify these settings.

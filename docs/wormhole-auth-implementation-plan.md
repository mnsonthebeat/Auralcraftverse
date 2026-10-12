# Auralcraftverse Wormhole + Authentication Implementation Plan

Status: planning and integration assessment only. No production files changed.

## Confirmed product decisions
- Typography: Space Grotesk (display), Manrope (body/interface), Michroma (short technical labels).
- Landing copy: "ENTER THE AURALCRAFTVERSE" / "An Independent Creative Ecosystem".
- Cinematic full-screen jump, then identity checkpoint, then reveal the existing site after verified sign-in.
- Free account required; paid subscription remains optional.
- Identity providers: Google and Apple through Supabase Auth.
- Preserve the intended destination for direct tool and guide links after authentication.
- Keep the existing React/Vite app and deploy architecture. Work on a separate branch and preview; do not merge to main before explicit approval.

## Current repository findings
- The app is a React 19 + Vite 6 + TypeScript frontend. Existing app code is in `src/App.tsx`; shared styling is in `src/index.css`; entry point is `src/main.tsx`.
- The current global font stack is Inter. The hero currently says "WELCOME TO AURALCRAFTVERSE", and the top navigation plus ecosystem sections are rendered immediately.
- Existing visual primitives include the starfield, orbit graphics, trajectory, and spacecraft illustration. Reuse/refine them for the entry sequence rather than replacing the site's visual language.
- `render.yaml` is a static Render service with automatic deploy on commits and automatic preview generation; it rewrites `/tools/*` and `/guides/*` to `/index.html`.
- Existing internal routes include `/tools/mixmind`, `/tools/hush-denoise`, `/tools/split-it`, and `/guides/*`. Preserve those route patterns and retain the requested path through sign-in.
- The three tool routes are wrappers around separately hosted AppDeploy origins using iframes. The source currently includes a standalone link that opens the underlying tool origin.
- The connected AppDeploy account exposes Split It! only. Its inspected source has no Supabase/Firebase/OAuth sign-in integration and no configured backend secrets. MixMind and Hush Denoise source/configuration are not available in this connected AppDeploy account, so their authentication and access model remain unverified.

## Important security boundary: embedded tools
Supabase authentication on `auralcraftverse.online` does not automatically authenticate or protect applications hosted on unrelated `*.appdeploy.ai` origins. The parent site's session is not a trusted credential for the iframe; third-party cookie/storage restrictions also make cross-origin iframe session sharing unreliable. Hiding the wrapper behind a sign-in gate only protects access through the parent wrapper, not a visitor who opens the standalone tool URL directly.

Before claiming all tools are protected, choose and implement one of:
1. Add Supabase authentication and authorization checks inside each tool app, using the same Supabase project and appropriate redirect settings; or
2. Move/proxy the tools behind a controlled same-site origin with a deliberate authorization design; or
3. Explicitly keep the standalone tools public while protecting only the Auralcraftverse ecosystem wrapper and member-only site features.

The user chose to protect the ecosystem and preserve intended destinations. That policy cannot be fully enforced for standalone iframe origins until the owners/source/configuration of all three tool apps are accessible and their access strategy is agreed. Do not represent parent login as protecting the external tools.

## Supabase and OAuth prerequisites
- A Supabase project (project URL and publishable/anon key) is required. The browser-facing key is designed for public clients but must be paired with correctly configured database/RLS policies where data is protected. Never put a service-role key in Vite/client code.
- Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as build-time environment variables in the isolated preview environment and production environment only when approved. Do not commit real credentials to Git.
- Enable Google provider in Supabase and supply Google OAuth client ID and client secret through the Supabase dashboard. Configure the Supabase callback URL with Google Cloud Console.
- Enable Apple provider in Supabase and configure the required Apple Developer identifiers/credentials (Service ID, Team ID, Key ID, and private key as required by the current Supabase provider setup). Apple sign-in needs a verified domain/return URL configuration appropriate to the chosen flow.
- Configure Supabase Auth URL settings: production site URL, exact production redirect allowlist, and the isolated Render preview origin(s). Preview URLs may vary; avoid broad wildcard redirects unless the provider explicitly supports a safely constrained pattern.
- Credentials should be entered into the relevant provider dashboards/secret-management UI, never pasted into source files or chat. Keep production credentials separate from preview configuration where possible; use a separate Supabase staging project if feasible.
- Before provider setup, confirm the account owner has access to the Supabase project, Google Cloud Console OAuth credentials, and Apple Developer account.

## Proposed application changes (isolated branch only)
1. Add an explicit entry state machine: arrival -> jumping -> authentication -> entered. The full navigation and ecosystem content must not be exposed in the arrival state.
2. Implement the cinematic transition with responsive motion, interruption-safe controls, keyboard support, and `prefers-reduced-motion` fallback.
3. Load and apply Space Grotesk, Manrope, and Michroma with CSS font tokens. Keep the Auralcraftverse mark itself unchanged.
4. Add Supabase client initialization with environment validation and auth/session state handling. Do not pretend sign-in succeeded when configuration is missing.
5. Use protected-route handling for the ecosystem and preserve a validated local return path (allow only same-site paths; reject external return URLs) across OAuth redirects.
6. Handle pending auth, provider errors/cancellation, session restoration, sign-out, and expired sessions accessibly.
7. Preserve public fallback/error states that explain setup is incomplete in preview rather than locking testers out silently.
8. Audit tool wrappers and guide routes, then implement the agreed route policy only to the extent enforceable by available integrations.

## Validation gates
- Build and lint/type checks pass; no changes on `main`.
- Arrival view has only the title, subtitle, and jump control before entry.
- Motion is smooth on mobile and desktop; reduced-motion users can still complete entry.
- Google and Apple login, callback handling, session restoration, sign-out, and direct-link return are tested with configured credentials.
- Invalid/external return URLs are rejected.
- Direct tool and guide routes are tested, including refresh and authentication return.
- Confirm the standalone tool URLs' access model separately; parent-site sign-in alone is insufficient.
- Review the isolated preview manually and obtain user approval before any production merge.

## Current execution status
A dedicated branch and draft PR have been created from `main`: `codex/auralcraftverse-wormhole-auth-preview` / https://github.com/mnsonthebeat/Auralcraftverse/pull/6.

The branch now contains the initial entry experience, display/body/technical font setup, environment-based Supabase client, OAuth buttons for Google and Apple, same-origin return-path validation, and a gate around the existing ecosystem. GitHub Actions build passed on the current branch head.

No Supabase project or OAuth provider has been configured, no credentials have been added, and no production deployment or merge has occurred. The sign-in flow is therefore not end-to-end validated yet. The next gate is to configure isolated preview environment variables and provider callbacks, obtain/verify the Render preview URL, test the visual flow, and resolve the documented cross-origin tool-access decision before production approval.

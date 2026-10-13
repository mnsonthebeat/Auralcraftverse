# Auralcraftverse Preservation & Integrity Standard

## Purpose

Protect the approved Auralcraftverse source, architecture, user journeys, and production baseline while allowing controlled, reviewable improvements.

## Source of truth and recovery

- The Git repository is the authoritative source of application code and version history.
- Treat `main` as the approved integration baseline. Do not develop features directly on `main`.
- Create a focused branch for each change and retain the pull request, CI result, and merge commit as the change record.
- Before high-risk refactors, dependency upgrades, routing changes, or deployment changes, identify the last known-good commit and ensure it can be checked out or reverted.
- Keep an independent backup or mirror of the repository and important deployment configuration. A Git branch in the same repository is not an independent backup.
- Never commit secrets, private keys, access tokens, user data, or production credentials. Store secrets in the appropriate hosting-provider secret store.

## Architecture preservation

- Prefer small, reversible changes that fit the current React + TypeScript + Vite application.
- Do not replace the application framework, restructure major directories, rewrite routing, or replace shared components without a documented rationale and explicit review.
- Preserve existing tool integrations and URL conventions unless the change explicitly addresses them.
- Keep configuration changes separate from feature changes where practical.
- Update documentation when architecture, routing, build, environment variables, or deployment behavior changes.

## Required change workflow

1. Inspect the current implementation and identify affected files and user journeys.
2. Create a focused branch from the current approved `main`.
3. Make the smallest change that solves the stated problem.
4. Review the complete diff for unrelated edits, accidental deletions, hard-coded credentials, and changes to routing or deployment.
5. Run the production build and any available relevant checks; add tests for new behavior when practical.
6. Verify key affected flows in a preview or local browser when available. A passing build is not a substitute for functional or live-site verification.
7. Open a pull request describing the intent, scope, risk, test evidence, and rollback plan.
8. Merge only after required checks pass and the diff has been reviewed. Confirm the resulting main-branch checks and deployment separately.

## CI and dependency integrity

- Use a committed package-manager lockfile for reproducible dependency installation.
- Once a valid npm lockfile is committed and reviewed, use `npm ci` in CI and production builds instead of resolving dependency ranges afresh with `npm install`.
- Keep the production build as a required check where repository settings support it.
- Add type-checking, automated tests, and dependency/security scanning in a staged way, validating each addition before making it a merge gate.
- Do not upgrade dependencies as incidental cleanup; review upgrades as a scoped change.

## Production and deployment safety

- Do not treat a successful CI build as proof that the public site is current or visually correct.
- Check the hosting provider's deployment result and verify the production URL after release when browser access is available.
- Avoid changing DNS, custom domains, authentication providers, database settings, paid plans, or production secrets as part of unrelated code changes.
- For risky releases, document the last known-good commit and the steps to revert.

## GitHub repository settings to verify

These settings are repository-owner actions and may not be configurable through the connected integration:

- Protect `main) with a ruleset or branch protection rule.
- Require pull requests before merging.
- Require the production build check and any established tests to pass.
- Block force-pushes and branch deletion on `main`.
- Restrict who can bypass the rules; keep bypass access minimal.
- Enable secret scanning and push protection where available for the repository plan.
- Review GitHub Actions permissions and third-party action usage.
- Maintain an independent backup or mirror and periodically test recovery.

Do not describe these settings as active until their status has been checked in GitHub.

## Scope boundaries

This standard is documentation and process guidance. It does not change application runtime code, dependencies, authentication, Supabase, DNS, custom domains, paid plans, or deployment settings.

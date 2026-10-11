# Split It! integration validation

Branch: `feature/split-it-tools-integration`

## Scope
- Adds Split It! to the existing Tools dropdown and Tools directory.
- Adds an Auralcraftverse tool chamber that embeds the existing isolated AppDeploy app.
- Keeps Split It! independently hosted; this change does not port its backend into the static website.
- Provides an always-visible “Open in new tab” fallback for authentication, browser storage, iframe, or download limitations.

## Guardrails
- `main` is untouched by this branch.
- Do not merge or deploy to production until the validation checklist passes and the owner approves.
- Do not add secrets or credentials to the static website repository.
- Treat cross-origin sign-in/session persistence as unverified until tested in the real browser.

## Manual validation checklist
- [ ] Website builds successfully with `npm run build`.
- [ ] Tools dropdown exposes Split It! and opens the Split It! chamber.
- [ ] Split It! iframe loads without browser console or network errors.
- [ ] Sign-in works inside the iframe, or the new-tab fallback works reliably.
- [ ] Create a test project, save it, navigate away, return, and reopen it.
- [ ] Add/edit contributors and confirm ownership validation.
- [ ] Export and inspect the PDF split sheet.
- [ ] Export and inspect the CSV in a spreadsheet application.
- [ ] Verify the embedded view and fallback link on desktop and mobile.
- [ ] Confirm no changes have landed on `main` and no production deployment was triggered.

## Known limitation
An iframe's visual load event alone does not prove authentication, persistence, or downloads work. Complete the user-driven checks above before considering the integration validated.

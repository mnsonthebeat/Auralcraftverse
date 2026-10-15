# Hush Denoise by Auralcraftverse

Standalone browser-based audio denoising and restoration app, exported from AppDeploy snapshot `1792047846299`.

## Deploy on Render (Static Site)

This app lives in `tools/hush-denoise/` inside the Auralcraftverse repository. Keep the main website's existing root directory and Render service unchanged.

Create a **new Static Site** using this repository and branch `handoff/hush-denoise` (or `main` after merging this handoff), with:

- **Root Directory:** `tools/hush-denoise`
- **Build Command:** `npm install && npm run build`
- **Publish Directory:** `dist`

The app is a Vite/React frontend. Audio processing runs in the browser; no audio upload backend is required for its client-side processing paths. Deploy it as a separate Render service so it does not replace the Auralcraftverse website.

## Local development

```bash
npm install
npm run dev
npm run build
```

## Source provenance

This folder contains the complete 13-file source snapshot from AppDeploy version `1792047846299`, including UI, CSS, Vite/Tailwind/TypeScript configuration, package manifest, tests, and snapshot backend files. The live AppDeploy app is unchanged by this source handoff.

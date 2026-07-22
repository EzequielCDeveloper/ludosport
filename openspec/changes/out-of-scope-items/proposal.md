# Proposal: Out-of-Scope Items (Code Quality)

## Intent

Address the 4 actionable findings from the code quality audit: testing infrastructure, CI/CD pipeline, placeholder image deduplication, and CSS extraction from inline styles. These maintenance improvements reduce technical debt without changing any user-facing behavior.

## Scope

### In Scope
1. **Tests**: Vitest + React Testing Library setup, first tests for NavbarClient (complex) and FAQs (simple)
2. **CI/CD**: GitHub Actions PR quality gates (type-check + lint + build), Netlify auto-deploy from main
3. **Placeholder images**: Source 8 new royalty-free images, update `ACTIVIDADES` array + Profesor
4. **CSS extraction**: Migrate 15 static inline styles → Tailwind arbitrary values or CSS classes; keep 1 dynamic style inline

### Out of Scope
- Full component test coverage (beyond NavbarClient + FAQs)
- E2E tests (Playwright/Cypress)
- Dual Starfield optimization — works correctly, no change
- ESLint config changes — already correct for Next.js 16
- Tailwind CSS eslint plugin — optional, deferred

## Capabilities

### New Capabilities
None — all items are infrastructure, config, or code-quality improvements without behavioral spec changes.

### Modified Capabilities
None — no existing spec requirements change.

## Approach

**Tests**: Install `vitest` + `@vitejs/plugin-react` + `jsdom` + `@testing-library/react` + `vite-tsconfig-paths`. Create `vitest.config.mts`. Write FAQs test first (render + basic assertions), then NavbarClient comprehensive tests (menu open/close, Escape key, backdrop click, focus management, keyboard nav).

**CI/CD**: Create `.github/workflows/ci.yml` with `tsc --noEmit`, `eslint`, `next build` on every PR. Netlify auto-deploys from `main` via native GitHub integration (dashboard config, no workflow file needed).

**Placeholder Images**: Curate 8 Unsplash/Pexels CC0 images at 600×400 (3:2). Update `lib/constants.ts` — assign unique image per activity. Update `Profesor.tsx` instructor image.

**CSS Extraction**: Convert simple static styles (boxShadow, backdropFilter, zIndex) to Tailwind arbitrary values. Extract complex gradients + textShadow to per-component CSS. Keep NavbarClient `right: menuOpen ? "0" : "-100%"` inline — it's the only truly dynamic style.

Delivery: 2 chained PRs. PR1: tests infra + CI/CD + images (~250 lines). PR2: CSS extraction (~150 lines).

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `.github/workflows/ci.yml` | New | CI quality gates on PR |
| `vitest.config.mts` | New | Vitest configuration |
| `package.json` | Modified | Add dev deps + test scripts |
| `lib/constants.ts` | Modified | Unique image per activity |
| `app/components/*.tsx` (8 files) | Modified | Inline styles → Tailwind/CSS |
| `public/placeholders/` | New | 8 image files |
| `app/components/FAQs.test.tsx` | New | First simple test |
| `app/components/NavbarClient.test.tsx` | New | Comprehensive component test |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Vitest plugin version mismatch with Next.js 16 | Low | Pin to recommended versions, verify build |
| Stock photo licensing obligations | Low | Choose CC0/public-domain only |
| CSS extraction visual regressions | Medium | Review on all viewports post-migration |

## Rollback Plan

- **Tests**: `git revert` config + test files, `npm uninstall` deps
- **CI/CD**: Delete `.github/workflows/ci.yml`
- **Images**: Revert `lib/constants.ts`, delete new files
- **CSS**: `git revert` — each inline style revert restores original visual

## Dependencies

- Vitest 3.x + `@vitejs/plugin-react` 4.x (verify Next.js 16 compat)
- Unsplash/Pexels: manual curation, no API keys
- Netlify GitHub integration: dashboard setup (one-time)

## Success Criteria

- [ ] `npx vitest run` passes with ≥2 test files
- [ ] GitHub Actions workflow runs on PR creation (type-check + lint + build)
- [ ] All 10 activities + Profesor have unique images
- [ ] No visual regressions after CSS extraction (verified on mobile + desktop)
- [ ] `npm run build` succeeds after all changes

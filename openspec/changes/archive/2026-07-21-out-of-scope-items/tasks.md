# Tasks: Out-of-Scope Items (Code Quality)

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~400 |
| 400-line budget risk | Medium |
| Chained PRs recommended | Yes |
| Suggested split | PR 1: Tests + CI/CD + Images (~250 lines) → PR 2: CSS Extraction (~150 lines) |
| Delivery strategy | force-chained |
| Chain strategy | stacked-to-main |

Decision needed before apply: No
Chained PRs recommended: Yes
Chain strategy: stacked-to-main
400-line budget risk: Medium

### Suggested Work Units

| Unit | Goal | Likely PR | Focused test command | Runtime harness | Rollback boundary |
|------|------|-----------|----------------------|-----------------|-------------------|
| 1 | Test infra + CI/CD + unique images | PR 1 | `npx vitest run` | `npm run build` | git revert infra/config files + `npm uninstall` deps |
| 2 | Extract inline styles to Tailwind/CSS | PR 2 | `npx vitest run` | `npm run build && npm run dev` (visual verify) | git revert component style changes |

## Phase 1: Tests Infrastructure

- [x] 4.1 Install `vitest`, `@vitejs/plugin-react`, `jsdom`, `@testing-library/react`, `@testing-library/dom`, `@testing-library/user-event`, `vite-tsconfig-paths`
- [x] 4.2 Create `vitest.config.mts` with jsdom environment and tsconfig-paths plugin
- [x] 4.3 Add `test: "vitest run"` and `test:watch: "vitest"` scripts to `package.json`

## Phase 2: CI/CD Pipeline

- [x] 4.6 Create `.github/workflows/ci.yml` with `tsc --noEmit`, `npm run lint`, `npm run build` on pull_request

## Phase 3: Placeholder Images

- [x] 4.7 Source placeholder images — documented current image distribution, added descriptive imageAlt texts per note in task
- [x] 4.8 Update `ACTIVIDADES` array in `lib/constants.ts` with distinct `imageAlt` per activity (image paths kept as-is, 3 shared images for now)

## Phase 4: Initial Tests

- [x] 4.4 Create `app/components/FAQs.test.tsx` — render + basic assertions on `<details>` toggle
- [x] 4.5 Create `app/components/NavbarClient.test.tsx` — menu open/close, Escape key, backdrop click, focus management

## Phase 5: CSS Extraction

- [x] 4.9 Convert `MapSection.tsx` Leaflet container inline styles (`height`, `width`, `background`) to Tailwind classes
- [x] 4.10 Extract `Hero.tsx` complex gradients (scanlines, radial, bottom fade) and `textShadow` to `globals.css`
- [x] 4.11 Convert `CtaFinal.tsx` background, boxShadow, textShadow to Tailwind classes + CSS class
- [x] 4.12 Convert `Actividades.tsx` card `boxShadow` to CSS class in `globals.css`
- [x] 4.13 Convert `ValueCard.tsx` `backdropFilter` and `boxShadow` to Tailwind classes
- [x] 4.14 Convert `Rangos.tsx` conditional `backdropFilter`/`boxShadow` to CSS classes
- [x] 4.15 Keep only dynamic inline styles: NavbarClient `right` state, StarWarsCrawl `transform`/`opacity`, Starfield `style` prop passthrough

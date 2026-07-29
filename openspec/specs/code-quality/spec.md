# Code Quality Specification

## Purpose

Defines code quality standards for the Ludosport project. These are NOT behavioral requirements — they are code health and maintainability standards.

## Quality Standards

### No Dead Code
The codebase MUST NOT contain exported functions, hooks, or constants that are unused. Dead code SHALL be removed.

### No ESLint Errors
The codebase MUST pass `eslint` with zero errors. Warnings SHOULD be resolved but MAY be accepted with justification.

### No TypeScript `any`
TypeScript code MUST NOT use `any` types. Use proper type imports or type assertions with specific types.

### Consistent Import Paths
All internal imports MUST use the `@/` path alias. Relative imports (`./`, `../`) SHALL only be used for colocated files within the same component group.

### Stable React Keys
React list keys MUST use stable identifiers (content-based IDs or unique properties), not array indices.

### Single Source of Truth
Coordinates, colors, and configuration data MUST be defined once in `lib/` and imported everywhere else.

### No Direct DOM Manipulation
React components MUST NOT manipulate the DOM outside React's rendering cycle (no `document.getElementById` + `classList`). State SHALL be passed via props.

### Image Optimization
Above-the-fold Next.js Image components MUST use the `priority` attribute. All Image components SHOULD specify `sizes` for responsive image selection.

---

## Added by fix-audit-warnings-suggestions (2026-07-28)

### shared-components

#### SPEC-FAWS-040: CtaButton Shared Component (HE-11)

The system MUST provide a `<CtaButton>` component with 4 variants (`cyan`, `white`, `blue`, `whatsapp`) that centralize WhatsApp URL construction, `target="_blank"`, `rel="noopener noreferrer"`, and consistent `aria-label` patterns.

**Acceptance**: All 4 CTA contexts use `<CtaButton>` with appropriate variant. Visual output matches current design.

| # | Scenario | GIVEN | WHEN | THEN |
|---|----------|-------|------|------|
| 1 | Hero CTA | Hero uses `<CtaButton variant="cyan">` | Renders | Same visual as current cyan border + white border style |
| 2 | Navbar CTA | Navbar uses `<CtaButton variant="blue">` | Renders | Same visual as current blue background style |
| 3 | CtaFinal CTA | CtaFinal uses `<CtaButton variant="cyan">` | Renders | Same visual as current cyan glow style |
| 4 | WhatsApp float | Float uses `<CtaButton variant="whatsapp">` | Renders | Same visual as current green circle style |

### unused-css-removal

#### SPEC-FAWS-043: Remove Unused Radius Tokens (HE-12)

The system MUST remove the unused `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-full` CSS custom properties from `globals.css` since they are not consumed by any component.

**Acceptance**: CSS custom properties for radius are absent from `globals.css`. No visual regressions.

| # | Scenario | GIVEN | WHEN | THEN |
|---|----------|-------|------|------|
| 1 | CSS inspection | Styles examined | `@theme inline` block | No `--radius-*` variables present |
| 2 | Visual parity | Page renders | All components compared | Identical to pre-change (Tailwind utilities unaffected) |

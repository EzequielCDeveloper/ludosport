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

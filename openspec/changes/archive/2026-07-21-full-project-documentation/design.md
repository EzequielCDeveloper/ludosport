# Design: Full Project Documentation

## Technical Approach

Four structured markdown documents, each mapped to its spec. Content derived from the exploration audit (verified against source code) and organized into consistent templates with Mermaid diagrams, component/hook catalogs, and step-by-step procedures. All docs include `last-reviewed` frontmatter for freshness tracking.

## Architecture Decisions

| Decision | Options | Tradeoff | Choice |
|----------|---------|----------|--------|
| README vs ARCHITECTURE split | Single doc vs separate | Single is simpler but mixed audiences | **Separate** — README is project identity + quickstart; ARCHITECTURE is internal codebase reference |
| Diagram format | Mermaid vs ASCII diagrams | Mermaid renders natively on GitHub but breaks if syntax is wrong; ASCII is foolproof but ugly | **Mermaid** — `graph TD` and `flowchart LR` for component tree and data flow; raw source included for GitHub rendering |
| Existing `docs/` audit reports | Preserve vs merge into ARCHITECTURE | Merging creates one mega-doc; preserving keeps audit trail integrity | **Preserve untouched** — audit reports have separate scope and audience |
| Dead code handling | Note in ARCHITECTURE vs remove files | Removal breaks git history and may surprise future devs | **Note only** — flag `useAccordion` and `useScrollVisibility` as dead with explanation |
| Content guide audience language | English (convention) vs Spanish (editor audience) | Spanish is more accessible to academy staff; English matches project convention | **English** per project convention; content types use Spanish example values matching the site |

## Document Structure Contracts

### README.md
- Frontmatter: `last-reviewed: 2026-07-21`
- Sections: Project title + badge → Screenshot + tagline → Tech stack table → Prerequisites → Quickstart commands → Project structure tree → Available scripts → Deployment → Contributing note
- Mermaid diagram: project file tree (`graph TD`)

### ARCHITECTURE.md
- Frontmatter: `last-reviewed: 2026-07-21`
- Sections: App Router tree (Mermaid `graph TD`) → Component catalog table (name, type SC/CC, reason, props, description) → Server/Client boundary rationale → Hooks catalog (params, return, consumers) → Data flow diagram (Mermaid `flowchart LR`) → Styling strategy (3-layer) → SEO/JSON-LD → Dead code note

### docs/development.md
- Frontmatter: `last-reviewed: 2026-07-21`
- Sections: Prerequisites → Setup guide (clone, install, dev, build, lint) → Project conventions (SC-by-default, kebab-case CSS, Tailwind v4, TS strict) → How to add a section → Build & deploy → Code style/linting → Troubleshooting

### docs/content.md
- Frontmatter: `last-reviewed: 2026-07-21`
- Sections: Content architecture overview → By-type update instructions (Activities, FAQs, Ranks, Values) with Before/After examples → Images & placeholders → Map coordinates → JSON-LD auto-generation → **What NOT to change** (no .tsx/.css files outside constants)

## Data Flow

```
Source code (app/, lib/, public/) ──→ Exploration audit ──→ Documentation
       │                                    │
       └── Verified against ────────────────┘
                                                  ┌─ README.md (external)
         Specs ──→ Design decisions ──→ 4 docs ──┼─ ARCHITECTURE.md (internal)
                                                  ├─ docs/development.md (dev onboarding)
                                                  └─ docs/content.md (content editors)
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `README.md` | Overwrite | Replace CNA boilerplate with project identity, stack table, quickstart, structure tree, deployment |
| `ARCHITECTURE.md` | Create | Full architecture doc with component catalog, hooks, boundaries, data flow, styling, SEO |
| `docs/development.md` | Create | Developer onboarding guide: setup, conventions, how-to-add-section, build/deploy, troubleshooting |
| `docs/content.md` | Create | Content editor guide: per-type update steps, images, coords, JSON-LD, do-not-modify boundary |

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Build integrity | All imports/references compile | `bun run build` — no broken references |
| Lint | Code quality | `bun run lint` — no new warnings |
| Manual | Cross-doc links | Verify every relative link resolves |
| Manual | Component/hook names | Spot-check against actual source files |

No unit or E2E tests required — documentation-only change.

## Threat Matrix

N/A — no routing, shell, subprocess, VCS/PR automation, executable-file classification, or process-integration boundary.

## Migration / Rollout

No migration required. Docs are additive (except README overwrite, which replaces boilerplate unrelated to the project). Rollback: `git revert` the commit.

## Open Questions

None. All decisions are documented above; specs provide complete coverage for all 4 documents.

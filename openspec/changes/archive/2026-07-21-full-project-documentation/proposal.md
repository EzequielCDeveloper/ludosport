# Proposal: Full Project Documentation

## Intent

No formal project documentation exists. The README is the default `create-next-app` template — irrelevant to the actual project. The site is fully built and deployed but has no architecture overview, component catalog, developer guide, or content management instructions. New contributors (or future self) must reverse-engineer the entire codebase.

## Scope

### In Scope
- **README.md** — Project overview, stack, local setup, deployment info
- **ARCHITECTURE.md** — App Router structure, SC/CC boundaries, 17-component catalog, 5-hook catalog, data flow, styling strategy, SEO setup
- **docs/development.md** — Developer guide: setup, conventions, build, deploy
- **docs/content.md** — Content management: how to update activities, FAQs, ranks, etc.

### Out of Scope
- Any source code modification
- Adding tests (unit/E2E)
- Content migration to CMS
- Deleting or moving existing `docs/` audit reports
- Refactoring dead code (`useAccordion`, `useScrollVisibility`)

## Capabilities

> No existing specs in `openspec/specs/` — all capabilities are new.

### New Capabilities
- `project-overview`: README with project identity, tech stack, quickstart, and deployment
- `architecture`: Full architecture document covering component tree, hooks, data flow, styling, SEO
- `developer-guide`: Onboarding guide for local setup, conventions, build & deploy
- `content-guide`: Instructions for non-developer content editors updating activities, FAQs, ranks

### Modified Capabilities
None

## Approach

1. Read every source file in the codebase (already done via exploration)
2. Extract patterns, component signatures, hook contracts, styling rules
3. Write 4 structured markdown documents using consistent headings, diagrams (Mermaid) for data flow, and tables for catalogs
4. Keep existing `docs/` audit reports untouched
5. Run `bun run build` to verify no broken references

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `README.md` | Overwritten | Replace CNA boilerplate with real project docs |
| `ARCHITECTURE.md` | New | Root-level architecture document |
| `docs/development.md` | New | Developer onboarding guide |
| `docs/content.md` | New | Content editor guide |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Docs drift from code post-creation | Medium | Include last-reviewed date; no auto-validation possible |
| Architectural detail omitted | Low | Exploration already covers every component/hook/constant |
| Build breaks from file references | Low | Run `bun run build` before finalizing |

## Rollback Plan

`git revert` the commit that adds these doc files. Files are additive only — no source code touched.

## Dependencies

None. This is a documentation-only change with no external dependencies.

## Success Criteria

- [ ] `README.md` exists with project overview, stack, setup, and deploy info
- [ ] `ARCHITECTURE.md` exists covering all 17 components, 5 hooks, data flow, styling, SEO
- [ ] `docs/development.md` exists with dev setup, conventions, build, deploy
- [ ] `docs/content.md` exists with content update instructions
- [ ] `bun run build` passes with no errors
- [ ] All component/hook/section names match current codebase

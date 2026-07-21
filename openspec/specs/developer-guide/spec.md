# Developer Guide Specification

## Purpose

Define the requirements for `docs/development.md` — the onboarding guide for developers setting up the project locally, understanding conventions, and contributing changes. This document MUST reduce setup time to under 10 minutes for a developer with the required tooling.

## Requirements

### Requirement: Local Development Setup

The developer guide MUST document all prerequisites (Node.js version, bun), and provide step-by-step setup instructions including clone, install, dev server, build, and lint.

#### Scenario: Developer sets up from scratch

- GIVEN a developer with bun and Node.js installed
- WHEN they follow the setup steps
- THEN `git clone`, `bun install`, `bun dev` succeed without errors
- AND the site is accessible at `http://localhost:3000`

#### Scenario: Prerequisites documented

- GIVEN a developer missing required tools
- WHEN they check the Prerequisites section
- THEN they see the required Node.js version and instructions to install bun

### Requirement: Project Conventions

The developer guide MUST document conventions for file naming, component patterns (Server Component by default, Client Component only when interactivity requires it), CSS approach (Tailwind v4 first), and TypeScript strict mode.

#### Scenario: Conventions are discoverable

- GIVEN a developer adding a new component
- WHEN they consult the conventions section
- THEN they know files use kebab-case for CSS modules, PascalCase for components
- AND they understand the SC-by-default rule and when to use `"use client"`

### Requirement: Adding a New Section or Component

The developer guide MUST include a step-by-step guide for adding a new section to the page, covering: creating the component file, adding to `page.tsx`, creating constants if needed, and updating the navigation links.

#### Scenario: New section added

- GIVEN a developer needs to add a new page section
- WHEN they follow the "Adding a Section" guide
- THEN they create the component, register it in `page.tsx`, add constants in `lib/constants.ts`, and add a nav link in `NAV_LINKS`
- AND the section appears in order on the page

### Requirement: Build and Deployment

The developer guide MUST document the build process (`bun run build`) and production deployment on Netlify, including the build command and output directory.

#### Scenario: Production build works

- GIVEN a developer preparing a deployment
- WHEN they run `bun run build`
- THEN the build succeeds with no errors
- AND they understand that Netlify auto-deploys from the default branch

### Requirement: Troubleshooting (MUST)

The developer guide MUST include a troubleshooting section covering common issues: port conflicts, dependency installation failures, TypeScript strict errors, and Tailwind v4 class not found.

#### Scenario: Common error resolved

- GIVEN a developer hits a common build error
- WHEN they check the troubleshooting section
- THEN they find the error description, root cause, and resolution steps

### Requirement: Code Style and Linting (SHOULD)

The developer guide SHOULD document linting setup (ESLint with `eslint-config-next/core-web-vitals` and TypeScript), how to run `bun run lint`, and any project-specific lint rules.

#### Scenario: Linting guide available

- GIVEN a developer needs to fix lint errors
- WHEN they read the code style section
- THEN they know how to run the linter and where the ESLint config lives

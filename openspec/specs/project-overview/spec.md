# Project Overview Specification

## Purpose

Define the requirements for the README.md — the project's front door for new developers, contributors, and evaluators. The README MUST provide a complete overview of the project identity, tech stack, setup instructions, and deployment information.

## Requirements

### Requirement: Project Identity

The README MUST identify the project as a **Ludo Sport Drake Academy** landing page — a Star Wars-themed contact sport academy in San Luis Río Colorado, Sonora, México.

#### Scenario: Reader understands project purpose

- GIVEN a new reader opens the README
- WHEN they read the title and first paragraph
- THEN they learn the academy name, location (San Luis Río Colorado, Sonora), sport (esgrima con sables de madera), and thematic (Star Wars)
- AND they see a screenshot or reference to the live site

### Requirement: Tech Stack Declaration

The README SHALL declare the full tech stack including Next.js 16, React 19, TypeScript 5, Tailwind CSS 4, and Leaflet 1.9.

#### Scenario: Tech stack is documented

- GIVEN a developer evaluating the project
- WHEN they read the Tech Stack section
- THEN they see every runtime dependency with version numbers
- AND they see dev dependencies (TypeScript, ESLint) and the package manager (bun)

### Requirement: Quickstart Guide

The README MUST include a step-by-step quickstart: clone, install dependencies, run dev server, build, and lint.

#### Scenario: New developer sets up locally

- GIVEN a developer with bun installed
- WHEN they follow the quickstart steps in order
- THEN `git clone`, `bun install`, `bun dev`, `bun run build`, and `bun run lint` each succeed
- AND the dev server starts on `localhost:3000`

#### Scenario: Missing prerequisites handled

- GIVEN a developer without bun or Node.js installed
- WHEN they read the Prerequisites section
- THEN they see the required Node.js version and a link to install bun

### Requirement: Deployment Information

The README MUST document the deployment platform (Netlify), the live URL, and the build command.

#### Scenario: Deployment info is discoverable

- GIVEN a reader needs to find the production URL
- WHEN they scan the README
- THEN they find `https://fluffy-lamington-27c3ae.netlify.app` (or equivalent custom domain)
- AND they see that the build command is `bun run build`

### Requirement: Available Scripts

The README MUST list all available npm/bun scripts: `dev`, `build`, `start`, `lint`.

#### Scenario: Scripts are documented

- GIVEN a developer working on the project
- WHEN they look for available commands
- THEN they see a table of scripts with descriptions of what each does

### Requirement: Project Structure (SHOULD)

The README SHOULD include a project structure tree showing top-level directories and key files.

#### Scenario: Directory layout is visible

- GIVEN a developer unfamiliar with the codebase
- WHEN they read the structure section
- THEN they see an annotated tree of `app/`, `lib/`, `public/`, `docs/`, and config files at root

### Requirement: No CNA Boilerplate

The README MUST NOT contain any `create-next-app` boilerplate text, default styles, or templated content from the framework generator.

#### Scenario: Fresh content verified

- GIVEN the README is reviewed
- WHEN checking for framework boilerplate
- THEN no CNA default markdown, emoji icons, or templated sections remain

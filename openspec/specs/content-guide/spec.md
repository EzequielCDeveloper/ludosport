# Content Guide Specification

## Purpose

Define the requirements for `docs/content.md` — the guide for non-developer content editors (academy staff) who need to update site content without touching component logic. This document MUST enable an editor to modify any content type without breaking the site.

## Requirements

### Requirement: Content Type Update Instructions

The content guide MUST include step-by-step instructions for updating each content type: activities (10 items), FAQs (6 items), ranks (5 levels), and values (3 items).

#### Scenario: Editor updates an activity

- GIVEN a content editor needs to change an activity
- WHEN they follow the "Updating Activities" steps
- THEN they open `lib/constants.ts`, locate the `ACTIVIDADES` array, modify the relevant entry
- AND the change appears on the site after build without any component modification

#### Scenario: Editor updates a FAQ

- GIVEN a content editor needs to add or remove a FAQ
- WHEN they follow the FAQ update steps
- THEN they modify the `FAQS` array in `lib/constants.ts`, adding or removing Q&A objects
- AND the FAQ component renders the updated list

#### Scenario: Editor updates rank progression

- GIVEN a content editor needs to change rank names or descriptions
- WHEN they follow the ranks update steps
- THEN they modify the `RANGOS` array in `lib/constants.ts`
- AND the rank cards display the new values

### Requirement: Location of Constants

The content guide MUST document that all editable content lives in `lib/constants.ts` and MUST NOT be changed elsewhere.

#### Scenario: Constants location is clear

- GIVEN a content editor searching for text to change
- WHEN they read the guide
- THEN they know to edit only `lib/constants.ts` and never component files

### Requirement: Icon Components

The content guide MUST document that value icons (DisciplinaIcon, PerseveranciaIcon, AutocontrolIcon) live in `app/components/icons/` and are referenced from constants. Editors MUST NOT change icons without developer guidance.

#### Scenario: Icon location documented

- GIVEN an editor wanting to change value icons
- WHEN they read the icons section
- THEN they learn where icon files are and that icon changes require a developer

### Requirement: JSON-LD Auto-Generation

The content guide MUST document that JSON-LD structured data is auto-generated from constants via `lib/json-ld.ts` — editors do NOT need to update JSON-LD separately when they change activities or FAQs.

#### Scenario: JSON-LD documented

- GIVEN an editor updating activities
- WHEN they follow the content update steps
- THEN they learn that the JSON-LD script tag updates automatically from the constant changes

### Requirement: Map Coordinate Updates

The content guide MUST document how to update the map location, including where the coordinates are defined (in `ACADEMY.coords` and verified in `MapSection.tsx`).

#### Scenario: Map location changed

- GIVEN the academy moves locations
- WHEN the editor follows the map update steps
- THEN they update `ACADEMY.address` and `ACADEMY.coords` in `lib/constants.ts`
- AND they verify coordinates match `MapSection.tsx`

### Requirement: What NOT to Change

The content guide MUST include a clear list of files and patterns editors MUST NOT modify: component files (`app/components/`), hooks (`app/hooks/`), layout (`app/layout.tsx`), CSS files, and config files.

#### Scenario: Boundaries are clear

- GIVEN an editor browsing the codebase
- WHEN they read the "Do Not Modify" section
- THEN they know not to touch any `.tsx` or `.css` files outside of `lib/constants.ts`
- AND they understand that breaking this rule may break the build

### Requirement: Image Replacement (SHOULD)

The content guide SHOULD document how to replace images: where activity images are referenced (`image` and `imageAlt` fields), where placeholder images live (`public/placeholders/`), and what image dimensions to use.

#### Scenario: Image replacement documented

- GIVEN an editor wanting to replace placeholder images
- WHEN they read the image replacement section
- THEN they learn which fields in `ACTIVIDADES` to update and what image sizes are expected

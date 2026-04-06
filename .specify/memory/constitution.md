<!--
SYNC IMPACT REPORT
==================
Version change: N/A (initial fill from template) → 1.0.0

Modified principles: None (initial creation)

Added sections:
  - Core Principles I–V:
      I.  Code Quality & Simplicity
      II. Test-Driven Development (NON-NEGOTIABLE)
      III. Functional Scope Discipline
      IV. UI Consistency & Accessibility
      V.  Monorepo Architecture
  - Technology Stack
  - Development Workflow
  - Governance

Removed sections: None (initial fill)

Templates reviewed:
  - .specify/templates/plan-template.md     ✅ No updates required
    (Constitution Check section populated per-feature — generic gate still valid)
  - .specify/templates/spec-template.md     ✅ No updates required
  - .specify/templates/tasks-template.md    ✅ No updates required
  - .specify/templates/agent-file-template.md ✅ No updates required
  - .specify/templates/checklist-template.md  ✅ No updates required

Deferred TODOs: None — all placeholder tokens resolved.
-->

# Todo App Constitution

## Core Principles

### I. Code Quality & Simplicity

All code MUST follow DRY (Don't Repeat Yourself), KISS (Keep It Simple), and SOLID principles
as defined in `docs/coding-guidelines.md`. Specifically:

- Variables and functions MUST use `camelCase`; React components MUST use `PascalCase`;
  constants MUST use `UPPER_SNAKE_CASE`.
- Each module, component, and function MUST have a single, well-defined responsibility (SRP).
- Common logic MUST be extracted into shared utilities rather than duplicated across files.
- Premature optimisation is PROHIBITED; write clear, readable code first.
- All code MUST pass ESLint without errors before merge; warnings MUST be reviewed and justified.
- Imports MUST follow the prescribed order: external libraries → internal modules → styles,
  with blank lines between groups.

**Rationale**: Consistent, readable code lowers onboarding time and reduces defect density
over the life of the project, which is especially important in a bootcamp reference codebase.

### II. Test-Driven Development (NON-NEGOTIABLE)

Tests MUST be written as part of the development process. The project targets ≥ 80% code
coverage across all packages.

- Unit tests MUST cover individual React components, Express route handlers, and utility
  functions in isolation.
- Integration tests MUST cover component interactions and frontend-to-backend API calls.
- Each test MUST be fully independent; shared mutable state between tests is PROHIBITED.
- All external dependencies (API calls, timers, localStorage) MUST be mocked in unit tests.
- Test files MUST live in co-located `__tests__/` directories and be named `{filename}.test.js`.
- End-to-end tests are explicitly out of scope for the current phase.

**Rationale**: Automated tests are the primary quality gate and constitute living documentation
of expected behaviour. The 80% floor prevents coverage erosion as new features are added.

### III. Functional Scope Discipline

The application is a single-user todo CRUD tool. All implementation MUST stay within the
boundaries defined in `docs/functional-requirements.md`. The following capabilities are
explicitly out of scope and MUST NOT be implemented without a formal constitution amendment:

- User authentication or multi-user support
- Priority levels, categories, tags, or filtering/search
- Bulk operations, undo/redo, or recurring todos
- Reminders, notifications, or push updates
- Mobile-specific optimisation beyond responsive CSS

Any new feature proposal MUST first demonstrate it fits within the existing functional scope,
or trigger the amendment procedure below.

**Rationale**: Scope creep is the primary risk for a demo/bootcamp application. Explicit
boundaries prevent half-finished features that dilute the core CRUD experience.

### IV. UI Consistency & Accessibility

All UI work MUST conform to the design system documented in `docs/ui-guidelines.md`:

- The Halloween-themed palette MUST be used in both modes:
  light primary `#ff6b35`, dark primary `#ff8c42`; accent purple `#9d4edd`.
- All spacing MUST follow the 8px grid (xs: 8px, sm: 16px, md: 24px, lg: 32px, xl: 48px).
- Typography MUST follow the defined scale (body 16px/400, heading 28px/700, button 14px/600).
- All interactive elements MUST be keyboard accessible and meet WCAG AA color-contrast standards.
- Dark/light mode preference MUST be persisted in `localStorage` and default to the OS/system
  preference on first visit.
- Motion and animation MUST be minimal to none consistent with the Material Design guidelines.

**Rationale**: A consistent, accessible UI establishes professional quality and ensures the
bootcamp demo is inclusive to all attendees regardless of assistive technology needs.

### V. Monorepo Architecture

The project MUST be maintained as a monorepo using npm workspaces with the following package
structure:

- `packages/frontend/` — React application
- `packages/backend/` — Express.js API server

New top-level packages MUST be justified and approved via a MINOR version amendment. Circular
dependencies between packages are PROHIBITED. Each package MUST be independently runnable and
testable via its own `package.json` scripts (`start`, `test`).

**Rationale**: The monorepo enables shared tooling, unified CI, and atomic commits spanning
both frontend and backend — critical for a cohesive full-stack bootcamp reference project.

## Technology Stack

- **Frontend**: React + React DOM, plain CSS, Jest + @testing-library/react
- **Backend**: Node.js v16+, Express.js, Jest
- **Package Manager**: npm v7+ with workspaces
- **Linting**: ESLint (no additional linters may be introduced without a MINOR amendment)
- **Runtime scope**: Single-user; no relational database — persistence via the existing
  Express API layer only

Technology upgrades that introduce breaking API or build-system changes MUST be treated as
MAJOR amendments to this constitution.

## Development Workflow

1. **Before coding**: Confirm the planned change is within functional scope (Principle III) and
   passes a constitution check against all five principles.
2. **Linting**: Code MUST pass `npm run lint` with no errors before opening a pull request.
3. **Testing gate**: All tests MUST pass (`npm test` from the monorepo root) and overall
   coverage MUST remain at or above 80%.
4. **Code review**: At least one peer review MUST be completed before merging to `main`.
5. **Branching**: Feature branches MUST follow the `[###-feature-name]` naming convention.

## Governance

This constitution supersedes all other development practices and guidelines when conflicts arise.
The `docs/` guidelines are the canonical source of detail; this constitution distils their
non-negotiable rules.

**Amendment procedure**:

1. Author a pull request that updates this file with the proposed change and version bump.
2. Document the rationale, what changed, and any migration plan required.
3. Obtain at least one reviewer approval before merging.
4. Update any affected `docs/`, templates, or source files in the same pull request.

**Versioning policy** (semantic, applied to this document):

- MAJOR: Backward-incompatible governance changes, principle removal, or redefinition.
- MINOR: New principle or section added, or materially expanded guidance.
- PATCH: Clarifications, wording fixes, typo corrections.

**Compliance review**: Constitution compliance MUST be verified during every pull-request review.
Non-compliant code MUST NOT be merged without either a fix or a documented, approved amendment.

**Version**: 1.0.0 | **Ratified**: 2026-04-06 | **Last Amended**: 2026-04-06

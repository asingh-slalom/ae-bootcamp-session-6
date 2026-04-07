# Implementation Plan: Support for Overdue Todo Items

**Branch**: `001-overdue-todo-support` | **Date**: 2026-04-06 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-overdue-todo-support/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Add a visual overdue indicator (red styling + "Overdue" text badge with `aria-label`) to the `TodoCard` component for any incomplete todo whose `dueDate` is strictly before today's local date. The overdue state is computed client-side at render time — no backend changes required — by comparing `todo.dueDate` (ISO 8601 `YYYY-MM-DD`) to `new Date()` in the user's browser timezone.

## Technical Context

**Language/Version**: JavaScript (ES2021), React 18.2  
**Primary Dependencies**: React 18.2, react-scripts 5.0.1 (CRA), @testing-library/react 14, Jest 29 (via react-scripts)  
**Storage**: N/A — overdue state is derived at render time; no persistence changes  
**Testing**: Jest + @testing-library/react + @testing-library/user-event; msw for API mocking  
**Target Platform**: Web browser (desktop), modern evergreen browsers  
**Project Type**: Web application (React SPA + Express.js API monorepo)  
**Performance Goals**: Overdue indicator visible within 1 second of list load (SC-001); no additional API calls  
**Constraints**: Frontend-only change; no backend modifications; `dueDate` already stored as `YYYY-MM-DD`; overdue date comparison uses client local timezone  
**Scale/Scope**: Single-user todo app; ~1 component modified (`TodoCard`), ~1 utility function added; affects all existing todo list views

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Gate | Status | Notes |
|-----------|------|--------|-------|
| I. Code Quality & Simplicity | `camelCase` functions, `PascalCase` components, SRP, DRY | ✅ PASS | `isOverdue` utility is a single-purpose helper; `TodoCard` receives no new props |
| II. TDD (NON-NEGOTIABLE) | Unit tests for new logic; ≥80% coverage maintained | ✅ PASS | `isOverdue` utility tested independently; `TodoCard` snapshot/behaviour tests updated |
| III. Functional Scope Discipline | Feature listed as in-scope in `docs/functional-requirements.md` | ✅ PASS | Overdue display is within CRUD todo scope; no auth, tags, filtering added |
| IV. UI Consistency & Accessibility | Halloween palette, 8px grid, WCAG AA, `aria-label` on badge | ✅ PASS | Red uses design-system color token; aria-label required by FR-008 |
| V. Monorepo Architecture | Frontend-only; no new top-level packages | ✅ PASS | Change confined to `packages/frontend/`

## Project Structure

### Documentation (this feature)

```text
specs/001-overdue-todo-support/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
packages/frontend/
├── src/
│   ├── components/
│   │   ├── TodoCard.js               # MODIFIED — add overdue indicator render logic
│   │   └── __tests__/
│   │       └── TodoCard.test.js      # MODIFIED — add overdue scenario tests
│   └── utils/
│       ├── overdueUtils.js           # NEW — isOverdue(dueDate, completed) helper
│       └── __tests__/
│           └── overdueUtils.test.js  # NEW — unit tests for isOverdue
```

**Structure Decision**: Web application layout (Option 2 — frontend + backend monorepo). The change is confined to the frontend package. A thin utility module (`overdueUtils.js`) is extracted to keep `TodoCard` focused on rendering (SRP) and to enable isolated unit testing of the date-comparison logic as required by Constitution Principle II.

## Complexity Tracking

> No constitution violations — table omitted.

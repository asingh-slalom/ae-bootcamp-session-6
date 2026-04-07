# Research: Support for Overdue Todo Items

**Phase**: 0 — Outline & Research  
**Branch**: `001-overdue-todo-support`  
**Date**: 2026-04-06

All unknowns from the Technical Context were pre-resolved via the specification clarification
session on 2026-04-06. The findings below document the decisions and rationale.

---

## Decision 1: Overdue Calculation Location

**Decision**: Client-side, computed at render time inside a dedicated utility function.  
**Rationale**: The spec explicitly states "frontend-only change; dueDate already supported by
backend." Computing client-side eliminates any backend round-trip, keeps the feature scoped to
a single package, and satisfies Constitution Principle V (no new packages).  
**Alternatives considered**:  
- Server-side `isOverdue` flag on the API response — rejected; backend changes are out of scope
  per spec assumptions, and a derived flag would become stale until the next API call.
- Inline computation inside `TodoCard` JSX — rejected; violates SRP (Constitution Principle I)
  and makes the logic untestable in isolation (required by Constitution Principle II).

---

## Decision 2: Date Comparison Approach

**Decision**: Compare `dueDate` (ISO 8601 `YYYY-MM-DD` string) to today's local date using
`new Date().toISOString().split('T')[0]` (or equivalent `YYYY-MM-DD` extraction), then do a
string lexicographic comparison. Both sides are `YYYY-MM-DD`, so lexicographic order equals
chronological order.  
**Rationale**: The spec mandates "user's local browser timezone" for determining today's date.
Using `new Date()` without UTC adjustments respects the local timezone. ISO date strings in
`YYYY-MM-DD` format compare correctly as strings (no `Date` parsing needed for the stored
value), avoiding timezone-shifting issues from `new Date(dueDate)`.  
**Alternatives considered**:  
- `new Date(dueDate) < new Date()` — rejected; `new Date(dueDate)` parses the date string as
  UTC midnight, causing off-by-one errors for users in timezones behind UTC (todo due "today"
  shows as overdue because UTC midnight is already yesterday locally).
- Using a date library (date-fns, dayjs) — rejected; KISS principle (Constitution I) and no
  external library is needed for a single comparison operation.

---

## Decision 3: Visual Indicator Implementation

**Decision**: Apply a CSS class (`todo-card--overdue`) to the root `<div>` of `TodoCard` to
apply red color/border styling, and render an inline `<span>` badge with the text "Overdue"
and `aria-label="Overdue"` inside `todo-content` when the todo is overdue.  
**Rationale**:  
- CSS class on the card root allows theme-aware styling (both light and dark mode via existing
  CSS custom properties) without inline styles that would violate the design system.
- The red color maps to the existing `--danger` color token (`#c62828` light / `#ef5350` dark)
  from `docs/ui-guidelines.md`, maintaining palette consistency.
- `aria-label` on the badge satisfies FR-008 and WCAG AA (Constitution Principle IV).  
**Alternatives considered**:  
- Inline `style={{ color: 'red' }}` — rejected; bypasses the design-system color tokens and
  fails dark mode.
- `role="status"` live region — rejected; overdue status is not a dynamic announcement but a
  static label; `aria-label` on the badge is sufficient.

---

## Decision 4: Utility Module vs Inline Logic

**Decision**: Extract `isOverdue(dueDate, completed)` into
`packages/frontend/src/utils/overdueUtils.js` as a named export.  
**Rationale**: Constitution Principle I (SRP) requires common logic to be extracted into shared
utilities. A dedicated module allows:
1. Pure unit tests with no React rendering overhead (Constitution Principle II).
2. Reuse in any future list/filter component without duplication (DRY).  
**Alternatives considered**:  
- Logic inlined in `TodoCard` — rejected; untestable in isolation, couples rendering to business
  logic.
- Utility in `services/` — rejected; services are for API communication; date utilities belong
  in `utils/`.

---

## Decision 5: Test Strategy

**Decision**:  
- **`overdueUtils.test.js`** (unit): pure function tests for all boundary conditions — past,
  today, future, null, completed/incomplete combinations.
- **`TodoCard.test.js`** (component): add behaviour tests asserting the overdue badge renders
  for overdue todos and does not render for on-time, completed, or dateless todos. Use
  `jest.useFakeTimers` / `jest.setSystemTime` to control "today" in tests.  
**Rationale**: Constitution Principle II requires unit tests for utility functions and component
behaviour tests for React components. Controlling `Date.now()` via fake timers makes tests
deterministic regardless of when they run.  
**Alternatives considered**:  
- Mocking `overdueUtils.isOverdue` in `TodoCard` tests — possible but unnecessary; the helper
  is cheap to call and the component tests should verify the full integration of the two layers.
- Snapshot tests for overdue state — rejected; behaviour assertions on class/badge presence are
  more robust and resilient to cosmetic changes.

---

## Summary of All Resolved Unknowns

| Unknown | Resolution |
|---------|-----------|
| Overdue visual form | Red color change (`--danger` token) + "Overdue" text badge |
| Current date source | `new Date()` in browser local timezone |
| Backend involvement | None; frontend-only |
| Accessibility requirement | `aria-label="Overdue"` on badge span |
| `dueDate` format | ISO 8601 `YYYY-MM-DD` string |
| Where to compute overdue | `utils/overdueUtils.js` pure function |
| Date comparison method | Lexicographic string compare on `YYYY-MM-DD` |
| Where to apply styling | CSS class `todo-card--overdue` on card root div |

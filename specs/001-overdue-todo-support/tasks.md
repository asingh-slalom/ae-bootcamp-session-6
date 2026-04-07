# Tasks: Support for Overdue Todo Items

**Input**: Design documents from `/specs/001-overdue-todo-support/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ui-contracts.md ✅, quickstart.md ✅

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: User story label (US1, US2) — only on user story phase tasks
- Exact file paths included in every description

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create the `utils/` directory structure required by the implementation plan. No new packages or dependencies are required — the project already has all runtime and testing libraries installed.

- [ ] T001 Create `packages/frontend/src/utils/` directory structure per implementation plan (plan.md § Project Structure)

---

## Phase 2: Foundational (Blocking Prerequisite)

**Purpose**: Implement the `isOverdue(dueDate, completed)` utility that BOTH user stories depend on. No user story work should begin until this phase is complete.

**⚠️ CRITICAL**: `TodoCard` changes in Phase 3 and Phase 4 both call `isOverdue`; this phase must be fully green before touching the component.

> **TDD**: Write the test file first (T002), run it to confirm RED, then implement (T003) until GREEN.

- [ ] T002 [P] Write unit tests covering all boundary conditions for `isOverdue` (past/today/future, completed/incomplete, null dueDate) in `packages/frontend/src/utils/__tests__/overdueUtils.test.js` — use `jest.useFakeTimers()` / `jest.setSystemTime()` to pin "today"
- [ ] T003 Implement `isOverdue(dueDate, completed)` named export using local-timezone `YYYY-MM-DD` string comparison in `packages/frontend/src/utils/overdueUtils.js` (makes T002 GREEN)

**Checkpoint**: Run `npm test --prefix packages/frontend -- --testPathPattern=overdueUtils` — all 5+ boundary-condition tests must pass before proceeding.

---

## Phase 3: User Story 1 — Visual Overdue Indicators on Todo List (Priority: P1) 🎯 MVP

**Goal**: Incomplete todos whose `dueDate` is strictly before today display a red `todo-card--overdue` root class and an inline `<span aria-label="Overdue" class="badge badge--overdue">Overdue</span>` badge. Completed todos, dateless todos, and on-time todos display no indicator.

**Independent Test**: Render `<TodoCard>` directly with `todo={{ dueDate: "2026-04-06", completed: 0 }}` (yesterday when today is 2026-04-07) and assert the badge and class are present; render with `completed: 1` and assert they are absent.

### Tests for User Story 1 ⚠️ Write FIRST — must FAIL before implementation

- [ ] T004 [P] [US1] Add overdue-rendering tests to `packages/frontend/src/components/__tests__/TodoCard.test.js`: assert `todo-card--overdue` class and accessible `aria-label="Overdue"` badge appear for an overdue todo; assert neither appears for on-time, completed, or dateless todos — pin date with `jest.setSystemTime()`

### Implementation for User Story 1

- [ ] T005 [US1] Update `packages/frontend/src/components/TodoCard.js` to import `isOverdue` from `../../utils/overdueUtils`, compute `const overdue = isOverdue(todo.dueDate, todo.completed)`, apply `todo-card--overdue` class to root `<div>` when `overdue` is true, and render `<span aria-label="Overdue" className="badge badge--overdue">Overdue</span>` inside `.todo-content` adjacent to `.todo-title` (contracts/ui-contracts.md § Output Contract)
- [ ] T006 [US1] Add `.todo-card--overdue` and `.badge--overdue` CSS rules in `packages/frontend/src/App.css` using the existing `--danger` color token (`#c62828` light / `#ef5350` dark) from the design system — no new color values introduced (data-model.md § UI State Mapping)

**Checkpoint**: Run `npm test --prefix packages/frontend -- --testPathPattern=TodoCard` — all US1 overdue-rendering assertions must pass. Manually verify the indicator appears/disappears in the browser for overdue vs on-time todos.

---

## Phase 4: User Story 2 — Overdue Status Updates Dynamically (Priority: P2)

**Goal**: When a user toggles an overdue todo to completed, the overdue indicator disappears immediately. When the same todo is toggled back to incomplete, the indicator reappears (if `dueDate` is still in the past). This behavior is inherently delivered by React's re-render cycle once US1 is correctly implemented — the tasks here add test coverage to confirm the reactive contract holds.

**Independent Test**: Render `<TodoCard>` with an overdue todo, simulate checking the completion checkbox (triggering `onToggle`), re-render the component with `completed: 1`, and assert the badge is gone; re-render with `completed: 0` again and assert the badge returns.

### Tests for User Story 2 ⚠️ Write FIRST — must FAIL before implementation

- [ ] T007 [P] [US2] Add toggle-driven overdue state tests to `packages/frontend/src/components/__tests__/TodoCard.test.js`: assert overdue badge is absent after re-render with `completed: 1` (spec.md US2 scenario 1), and re-present after re-render with `completed: 0` (spec.md US2 scenario 2) — pin date with `jest.setSystemTime()`

### Implementation for User Story 2

- [ ] T008 [US2] Confirm `packages/frontend/src/components/TodoCard.js` re-evaluates `isOverdue` on every render from live `todo.completed` prop — no new code expected if T005 implementation is correct; add a code comment documenting the reactive contract if not already present

**Checkpoint**: Run `npm test --prefix packages/frontend -- --testPathPattern=TodoCard` — all US1 and US2 tests must pass. Manually toggle an overdue todo in the browser and confirm the badge updates without a page reload.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: End-to-end validation, accessibility spot-check, and quickstart verification.

- [ ] T009 [P] Run the full frontend test suite and confirm no regressions: `npm test --prefix packages/frontend -- --watchAll=false --coverage` — coverage must remain ≥ 80%
- [ ] T010 Validate all quickstart.md scenarios end-to-end in the running app (`npm start --prefix packages/frontend`) against the test cases in `specs/001-overdue-todo-support/quickstart.md`
- [ ] T011 [P] Spot-check accessibility: verify the rendered "Overdue" badge has `aria-label="Overdue"` in DevTools and announces correctly in a screen reader or axe extension (FR-008, contracts/ui-contracts.md § Accessibility Contract)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 — **BLOCKS all user stories**
- **User Story 1 (Phase 3)**: Depends on Phase 2 completion — no dependency on US2
- **User Story 2 (Phase 4)**: Depends on Phase 2 completion — directly builds on US1 implementation (T005); T007 tests can start in parallel with T005, but T008 confirms T005 behavior
- **Polish (Phase 5)**: Depends on all user story phases being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Phase 2 — no dependency on US2
- **User Story 2 (P2)**: Can start after Phase 2 — reactive contract relies on US1 implementation (T005) being complete before T008 is validated; T007 (tests) can be written in parallel with T005

### Within Each User Story

- Tests (T004, T007) MUST be written and FAIL before implementation (T005, T008)
- Tests only depend on the foundational utility (Phase 2) and Jest fake-timer setup
- CSS (T006) can be worked on in parallel with implementation (T005) — different file

### Parallel Opportunities

- T002 (test) and T003 (utility) follow TDD sequence — T003 starts after T002 is RED
- T004 (component tests) can start immediately after T002/T003 are complete — independent of T006 (CSS)
- T005 (TodoCard logic) and T006 (CSS) are in **different files** — can be done in parallel once T004 is RED
- T007 (toggle tests) can start once T004 is written — independent of T008
- T009, T011 (validation tasks) are independent — can run in parallel after all story phases complete

---

## Parallel Example: User Story 1

```bash
# After Phase 2 is complete:
#   Stream A — Component logic (T004 → T005)
#   Stream B — CSS styling (T006, no dependencies on T004/T005)

# Stream A:
# 1. Write failing tests (T004)
npm test --prefix packages/frontend -- --testPathPattern=TodoCard --watch

# 2. Implement TodoCard changes (T005) until tests pass

# Stream B (parallel with Stream A):
# Add CSS rules in App.css (T006)
```

---

## Implementation Strategy

### MVP Scope (Recommended First Delivery)

> Deliver **User Story 1 only** (Phases 1–3) as the MVP. This satisfies the core feature
> value — users can immediately identify overdue todos — and validates the full TDD cycle on
> the utility and component layers. User Story 2 is inherently delivered by the same
> implementation but Phase 4 adds explicit test coverage to lock in the reactive contract.

### Incremental Delivery

1. **MVP**: Phases 1–3 → Overdue indicator visible on list load (SC-001, SC-002)
2. **Complete**: Phase 4 → Dynamic toggle behavior verified (SC-003)
3. **Validated**: Phase 5 → Full coverage, accessibility, and manual quickstart sign-off (SC-004)

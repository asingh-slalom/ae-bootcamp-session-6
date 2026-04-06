# Feature Specification: Support for Overdue Todo Items

**Feature Branch**: `001-overdue-todo-support`  
**Created**: 2026-04-06  
**Status**: Draft  
**Input**: User description: "Support for Overdue Todo Items - Users need a clear, visual way to identify which todos have not been completed by their due date."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visual Overdue Indicators on Todo List (Priority: P1)

A user opens their todo list and can immediately see which incomplete todos are past their due date without needing to manually compare dates. Overdue todos are visually distinguished from on-time and completed todos.

**Why this priority**: This is the core value of the feature — without it, users must manually inspect each todo's date, which defeats the purpose. All other stories build on top of this visual distinction.

**Independent Test**: Can be fully tested by creating an incomplete todo with yesterday's date and verifying that it appears visually different from a todo with a future date or no due date.

**Acceptance Scenarios**:

1. **Given** an incomplete todo with a due date in the past, **When** the user views the todo list, **Then** the todo is displayed with a red color change plus a text badge labeled "Overdue".
2. **Given** an incomplete todo with a due date today or in the future, **When** the user views the todo list, **Then** the todo does not display any overdue indicator.
3. **Given** a completed todo with a due date in the past, **When** the user views the todo list, **Then** the todo does not display an overdue indicator (completed tasks are not overdue).
4. **Given** a todo with no due date, **When** the user views the todo list, **Then** the todo does not display any overdue indicator.

---

### User Story 2 - Overdue Status Updates Dynamically (Priority: P2)

A user who completes an overdue todo sees the overdue indicator immediately disappear upon completion, confirming that the task is no longer outstanding.

**Why this priority**: Without this, the overdue state would become stale and misleading after a user marks a task done. This ensures consistency between the completion state and the overdue visual.

**Independent Test**: Can be fully tested by marking an overdue todo as complete and verifying the overdue indicator is removed from the item.

**Acceptance Scenarios**:

1. **Given** an overdue todo displayed with an overdue indicator, **When** the user marks the todo as complete, **Then** the overdue indicator disappears immediately.
2. **Given** a completed todo that was previously overdue, **When** the user marks the todo as incomplete again, **Then** the overdue indicator reappears if the due date is still in the past.

---

### Edge Cases

- What happens when a todo's due date is exactly today? It is not overdue — only dates strictly before today trigger the overdue state.
- What happens when a user edits an overdue todo's due date to a future date? The overdue indicator disappears immediately.
- What happens when a user edits a non-overdue todo's due date to a past date? The overdue indicator appears immediately.
- How does the system handle todos with no due date? They are never treated as overdue regardless of other attributes.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST display a distinct visual indicator — a red color change combined with an "Overdue" text badge — on any incomplete todo whose due date is strictly before the current date.
- **FR-002**: The system MUST NOT display an overdue indicator on completed todos, regardless of their due date.
- **FR-003**: The system MUST NOT display an overdue indicator on todos with no due date.
- **FR-004**: The overdue indicator MUST disappear immediately when a user marks an overdue todo as complete.
- **FR-005**: The overdue indicator MUST reappear immediately when a user marks a previously-overdue todo as incomplete (if the due date is still in the past).
- **FR-006**: The overdue status MUST be recalculated based on the current date each time the todo list is rendered.
- **FR-007**: The system MUST update the overdue indicator immediately when a todo's due date is edited to a new value.
- **FR-008**: The "Overdue" badge MUST be accessible to screen readers via an appropriate `aria-label` attribute so assistive technologies can announce the overdue state.

### Key Entities

- **Todo Item**: Represents a task with a title, optional due date, and a completion status. The overdue state is a derived attribute — not stored — computed by comparing the due date to the current date and the completion status.
- **Due Date**: An optional date value on a Todo Item, stored and compared as an **ISO 8601 date string (YYYY-MM-DD)**. When present and in the past relative to today, and the todo is incomplete, it makes the item overdue.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can identify all overdue tasks at a glance without reading individual due dates — overdue items are visually distinct within 1 second of the list loading.
- **SC-002**: 100% of incomplete todos with a due date before today display an overdue indicator; 0% of other todos display the indicator.
- **SC-003**: Overdue indicator state updates are reflected immediately (within the same user interaction) when a todo is completed, restored, or its due date is changed.
- **SC-004**: Users spend less time scanning the todo list to find tasks needing attention, as measured by the ability to identify overdue items without reading individual dates.

## Assumptions

- A todo is overdue only if it is both **incomplete** and has a **due date strictly before today** (not including today).
- The "current date" for overdue calculation is determined client-side at render time using the **user's local browser timezone**; no server-side overdue flag is stored.
- The existing due date field on todos does not require any changes — no new data fields are introduced.
- This is a **frontend-only change**; the `dueDate` field is already stored and returned by the backend with no backend modifications required.
- This feature applies to the todo list view only; no overdue-specific filtering, sorting, or grouping is in scope for this version.
- Mobile-specific optimization is out of scope — the visual indicator should be legible on desktop layouts.

## Clarifications

### Session 2026-04-06

- Q: What form should the overdue visual indicator take? → A: Color change + text badge/label (red styling + "Overdue" badge)
- Q: How should the current date be determined for overdue calculation? → A: Use local browser timezone
- Q: Is backend involvement required for this feature? → A: Frontend-only; dueDate already supported by backend
- Q: Should the overdue badge be accessible to screen readers? → A: Yes; badge must have aria-label for screen reader announcement
- Q: What format should the dueDate field use? → A: ISO 8601 date string (YYYY-MM-DD)

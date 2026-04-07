# UI Contracts: Support for Overdue Todo Items

**Phase**: 1 — Design & Contracts  
**Branch**: `001-overdue-todo-support`  
**Date**: 2026-04-06

---

## Component Contract: `TodoCard`

**File**: `packages/frontend/src/components/TodoCard.js`  
**Change type**: Internal render logic only — **no prop API changes**

### Props Interface (unchanged)

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `todo` | `Object` | Yes | Todo item from the API (see data-model.md) |
| `todo.id` | `number` | Yes | Unique identifier |
| `todo.title` | `string` | Yes | Display label |
| `todo.completed` | `number` (0\|1) | Yes | Completion flag |
| `todo.dueDate` | `string\|null` | No | ISO 8601 `YYYY-MM-DD`; `null` if absent |
| `onToggle` | `(id: number) => Promise<void>` | Yes | Called on checkbox change |
| `onEdit` | `(id: number, title: string, dueDate: string\|null) => Promise<void>` | Yes | Called on save |
| `onDelete` | `(id: number) => void` | Yes | Called on delete confirm |
| `isLoading` | `boolean` | Yes | Disables interactive elements during async ops |

### Output Contract: Overdue Indicator

When `isOverdue(todo.dueDate, todo.completed)` returns `true`, the component MUST render:

1. **Root element class**: `todo-card todo-card--overdue` (adds `todo-card--overdue`)  
2. **Badge element** (inside `.todo-content`, adjacent to `.todo-title`):
   ```html
   <span class="badge badge--overdue" aria-label="Overdue">Overdue</span>
   ```

When `isOverdue` returns `false`, the component renders with `class="todo-card"` and no badge
(existing behaviour — unchanged).

### Accessibility Contract

- The overdue badge MUST carry `aria-label="Overdue"` to satisfy FR-008 and WCAG AA.
- Screen readers announce "Overdue" for the badge element.
- The visual colour change alone is NOT an accessibility-compliant indicator; the text badge
  with `aria-label` is the accessible complement.

---

## Utility Contract: `isOverdue`

**File**: `packages/frontend/src/utils/overdueUtils.js`

```js
/**
 * Determines whether a todo item is overdue.
 * @param {string|null} dueDate - ISO 8601 date string (YYYY-MM-DD), or null
 * @param {number|boolean} completed - Completion flag (0/false = incomplete, 1/true = complete)
 * @returns {boolean} true if the todo is incomplete and its dueDate is strictly before today
 */
export function isOverdue(dueDate, completed) { ... }
```

**Contracts**:

| Input | Expected output |
|-------|----------------|
| `dueDate = null`, any `completed` | `false` |
| `completed` truthy, any `dueDate` | `false` |
| `dueDate` === today's local `YYYY-MM-DD`, incomplete | `false` |
| `dueDate` < today's local `YYYY-MM-DD`, incomplete | `true` |
| `dueDate` > today's local `YYYY-MM-DD`, incomplete | `false` |

**Purity**: The function MUST be pure with respect to a given "today" value. Tests MUST control
`Date` via `jest.useFakeTimers()` / `jest.setSystemTime()` to make results deterministic.

---

## REST API Contract (unchanged)

The existing todos API is not modified. The relevant fields already present in the response:

```
GET /api/todos
GET /api/todos/:id

Response shape (relevant fields):
{
  "id": number,
  "title": string,
  "completed": 0 | 1,
  "dueDate": "YYYY-MM-DD" | null
}
```

No new endpoints, request fields, or response fields are added by this feature.

# Data Model: Support for Overdue Todo Items

**Phase**: 1 — Design & Contracts  
**Branch**: `001-overdue-todo-support`  
**Date**: 2026-04-06

---

## Existing Entity: Todo Item

No schema changes are required. The `dueDate` field already exists in the backend and is
returned by the API. The overdue state is a **derived, computed attribute** — not stored.

### Todo Object Shape (API response)

```json
{
  "id": 1,
  "title": "Finish the report",
  "completed": 0,
  "dueDate": "2026-04-01",
  "createdAt": "2026-03-25T09:00:00.000Z"
}
```

| Field | Type | Nullable | Description |
|-------|------|----------|-------------|
| `id` | `INTEGER` | No | Auto-incrementing primary key |
| `title` | `TEXT` (max 255) | No | User-provided task label |
| `completed` | `INTEGER` (0 or 1) | No | Completion flag; `0` = incomplete, `1` = complete |
| `dueDate` | `TEXT` (YYYY-MM-DD) | Yes | Optional ISO 8601 date; `null` if not set |
| `createdAt` | `TEXT` (ISO 8601) | No | Timestamp of creation |

> **Note on `completed` type**: The SQLite backend stores `completed` as an integer (`0`/`1`).
> In `TodoCard.js` the check is `todo.completed === 1`; the `isOverdue` utility must treat any
> truthy-but-not-1 value consistently (best checked as `!todo.completed` to cover both
> `0` and `false`).

---

## Derived Attribute: `isOverdue`

`isOverdue` is **not persisted**. It is computed in the browser at render time by the utility
function `isOverdue(dueDate, completed)` in `utils/overdueUtils.js`.

### Derivation Rule

```
isOverdue(dueDate, completed) = true
  IF  dueDate is not null
  AND dueDate (YYYY-MM-DD) < today's local date (YYYY-MM-DD)
  AND completed is falsy (0, false)
ELSE false
```

### "Today" Calculation

```js
// Returns today's date as YYYY-MM-DD in the browser's local timezone
const today = new Date();
const yyyy = today.getFullYear();
const mm = String(today.getMonth() + 1).padStart(2, '0');
const dd = String(today.getDate()).padStart(2, '0');
const todayStr = `${yyyy}-${mm}-${dd}`;
```

String lexicographic comparison is valid for `YYYY-MM-DD` format (ISO 8601 dates sort
correctly as strings).

### Boundary Conditions

| Scenario | `dueDate` | `completed` | `isOverdue` result |
|----------|-----------|-------------|-------------------|
| Due yesterday, incomplete | `"2026-04-05"` | `0` | `true` |
| Due today, incomplete | `"2026-04-06"` | `0` | `false` (today is not overdue) |
| Due tomorrow, incomplete | `"2026-04-07"` | `0` | `false` |
| Due yesterday, **complete** | `"2026-04-05"` | `1` | `false` |
| No due date, incomplete | `null` | `0` | `false` |
| No due date, complete | `null` | `1` | `false` |

---

## New Source File: `utils/overdueUtils.js`

```
packages/frontend/src/utils/overdueUtils.js
```

**Exports**:

| Export | Signature | Returns |
|--------|-----------|---------|
| `isOverdue` | `(dueDate: string\|null, completed: number\|boolean) => boolean` | `true` if the todo is overdue |

---

## UI State Mapping

| `isOverdue` result | CSS class on `TodoCard` root | Badge rendered |
|-------------------|------------------------------|----------------|
| `true` | `todo-card todo-card--overdue` | `<span aria-label="Overdue" className="badge badge--overdue">Overdue</span>` |
| `false` | `todo-card` (unchanged) | *(none)* |

The `todo-card--overdue` class applies red styling using the existing `--danger` color token
(`#c62828` in light mode, `#ef5350` in dark mode) from the design system. No new color values
are introduced.

# Quickstart: Implementing Overdue Todo Support

**Phase**: 1 — Design & Contracts  
**Branch**: `001-overdue-todo-support`  
**Date**: 2026-04-06

This guide walks a developer from a clean checkout to a passing implementation of the overdue
todo indicator feature.

---

## Prerequisites

- Node.js v16+ and npm v7+
- Repository cloned; dependencies installed

```bash
cd ae-bootcamp-session-6
npm install          # installs workspaces (frontend + backend)
```

---

## Step 1 — Switch to the feature branch

```bash
git checkout 001-overdue-todo-support
```

---

## Step 2 — Create the `isOverdue` utility (test first)

### 2a. Write the test

Create `packages/frontend/src/utils/__tests__/overdueUtils.test.js`:

```js
import { isOverdue } from '../overdueUtils';

describe('isOverdue', () => {
  beforeEach(() => {
    // Pin "today" to 2026-04-06 for all tests
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-04-06T12:00:00'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns true for an incomplete todo with a past due date', () => {
    expect(isOverdue('2026-04-05', 0)).toBe(true);
  });

  it('returns false for due date exactly today', () => {
    expect(isOverdue('2026-04-06', 0)).toBe(false);
  });

  it('returns false for a future due date', () => {
    expect(isOverdue('2026-04-07', 0)).toBe(false);
  });

  it('returns false for a completed todo with a past due date', () => {
    expect(isOverdue('2026-04-05', 1)).toBe(false);
  });

  it('returns false when dueDate is null', () => {
    expect(isOverdue(null, 0)).toBe(false);
  });
});
```

### 2b. Implement the utility

Create `packages/frontend/src/utils/overdueUtils.js`:

```js
/**
 * Returns today's date as a YYYY-MM-DD string in the browser's local timezone.
 * @returns {string}
 */
function getTodayDateString() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Determines whether a todo item is overdue.
 * A todo is overdue when it is incomplete and its dueDate is strictly before today.
 *
 * @param {string|null} dueDate - ISO 8601 date string (YYYY-MM-DD), or null
 * @param {number|boolean} completed - 0/false = incomplete; 1/true = complete
 * @returns {boolean}
 */
export function isOverdue(dueDate, completed) {
  if (!dueDate || completed) return false;
  return dueDate < getTodayDateString();
}
```

Run tests:

```bash
npm run test:frontend
```

---

## Step 3 — Update `TodoCard` to show the overdue indicator

In `packages/frontend/src/components/TodoCard.js`:

1. **Import** `isOverdue`:
   ```js
   import { isOverdue } from '../utils/overdueUtils';
   ```

2. **Compute** the derived flag inside the component (before the `if (isEditing)` branch):
   ```js
   const overdue = isOverdue(todo.dueDate, todo.completed);
   ```

3. **Add** `todo-card--overdue` class to the root div:
   ```jsx
   <div className={`todo-card ${todo.completed ? 'completed' : ''} ${overdue ? 'todo-card--overdue' : ''}`}>
   ```

4. **Render** the badge inside `.todo-content` (after `.todo-title`):
   ```jsx
   {overdue && (
     <span className="badge badge--overdue" aria-label="Overdue">
       Overdue
     </span>
   )}
   ```

---

## Step 4 — Add CSS for the overdue state

In `packages/frontend/src/App.css` (or `styles/theme.css`):

```css
/* Overdue todo card */
.todo-card--overdue {
  border-color: var(--danger, #c62828);
  background-color: rgba(198, 40, 40, 0.05);
}

.todo-card--overdue .todo-title {
  color: var(--danger, #c62828);
}

.badge--overdue {
  display: inline-block;
  font-size: 11px;
  font-weight: 600;
  color: #fff;
  background-color: var(--danger, #c62828);
  border-radius: 4px;
  padding: 2px 6px;
  margin-left: 8px;
  vertical-align: middle;
}
```

---

## Step 5 — Update `TodoCard` tests

In `packages/frontend/src/components/__tests__/TodoCard.test.js`, add:

```js
import { isOverdue } from '../../utils/overdueUtils';

// Pin today for component tests too
beforeEach(() => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date('2026-04-06T12:00:00'));
});

afterEach(() => {
  jest.useRealTimers();
});

it('shows overdue badge for an incomplete todo with a past due date', () => {
  const todo = { id: 1, title: 'Old task', completed: 0, dueDate: '2026-04-05' };
  render(<TodoCard todo={todo} onToggle={jest.fn()} onEdit={jest.fn()} onDelete={jest.fn()} isLoading={false} />);
  expect(screen.getByLabelText('Overdue')).toBeInTheDocument();
});

it('does not show overdue badge for a completed todo with a past due date', () => {
  const todo = { id: 1, title: 'Done task', completed: 1, dueDate: '2026-04-05' };
  render(<TodoCard todo={todo} onToggle={jest.fn()} onEdit={jest.fn()} onDelete={jest.fn()} isLoading={false} />);
  expect(screen.queryByLabelText('Overdue')).not.toBeInTheDocument();
});

it('does not show overdue badge for a todo with no due date', () => {
  const todo = { id: 1, title: 'No date', completed: 0, dueDate: null };
  render(<TodoCard todo={todo} onToggle={jest.fn()} onEdit={jest.fn()} onDelete={jest.fn()} isLoading={false} />);
  expect(screen.queryByLabelText('Overdue')).not.toBeInTheDocument();
});
```

---

## Step 6 — Run all tests and confirm coverage ≥ 80%

```bash
npm test   # runs frontend + backend suites from monorepo root
```

Expected: all tests pass, coverage report shows ≥ 80% for `packages/frontend/src`.

---

## Step 7 — Lint

```bash
npm run lint --workspace=frontend    # or: cd packages/frontend && npx eslint src
```

No errors should be reported.

---

## Verification checklist

- [ ] `isOverdue` unit tests all pass
- [ ] `TodoCard` shows "Overdue" badge (with `aria-label`) for overdue incomplete todos
- [ ] `TodoCard` does not show badge for completed todos
- [ ] `TodoCard` does not show badge for todos with no due date
- [ ] CSS overdue styles applied (red border, red title, red badge)
- [ ] Overdue badge disappears immediately when todo is marked complete (React re-render)
- [ ] Overall test coverage ≥ 80%
- [ ] No ESLint errors

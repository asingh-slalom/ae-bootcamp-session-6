/**
 * Determines whether a todo item is overdue.
 * @param {string|null} dueDate - ISO 8601 date string (YYYY-MM-DD), or null
 * @param {number|boolean} completed - Completion flag (0/false = incomplete, 1/true = complete)
 * @returns {boolean} true if the todo is incomplete and its dueDate is strictly before today
 */
export function isOverdue(dueDate, completed) {
  if (!dueDate || completed) {
    return false;
  }

  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const todayStr = `${yyyy}-${mm}-${dd}`;

  return dueDate < todayStr;
}

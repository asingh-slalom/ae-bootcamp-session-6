import { isOverdue } from '../overdueUtils';

describe('isOverdue', () => {
  const TODAY = '2026-04-07';

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-04-07T12:00:00.000Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns false when dueDate is null', () => {
    expect(isOverdue(null, 0)).toBe(false);
  });

  it('returns false when dueDate is null and completed', () => {
    expect(isOverdue(null, 1)).toBe(false);
  });

  it('returns false when todo is completed even if dueDate is in the past', () => {
    expect(isOverdue('2026-04-06', 1)).toBe(false);
  });

  it('returns true when dueDate is strictly before today and incomplete', () => {
    expect(isOverdue('2026-04-06', 0)).toBe(true);
  });

  it('returns false when dueDate equals today and incomplete (today is not overdue)', () => {
    expect(isOverdue(TODAY, 0)).toBe(false);
  });

  it('returns false when dueDate is in the future and incomplete', () => {
    expect(isOverdue('2026-04-08', 0)).toBe(false);
  });

  it('returns false when completed is falsy boolean (false)', () => {
    expect(isOverdue('2026-04-06', false)).toBe(true);
  });

  it('returns false when completed is truthy boolean (true)', () => {
    expect(isOverdue('2026-04-06', true)).toBe(false);
  });
});

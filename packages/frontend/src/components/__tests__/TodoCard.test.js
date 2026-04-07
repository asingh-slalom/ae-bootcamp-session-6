import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TodoCard from '../TodoCard';

describe('TodoCard Component', () => {
  const mockTodo = {
    id: 1,
    title: 'Test Todo',
    dueDate: '2025-12-25',
    completed: 0,
    createdAt: '2025-11-01T00:00:00Z'
  };

  const mockHandlers = {
    onToggle: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render todo title and due date', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    expect(screen.getByText('Test Todo')).toBeInTheDocument();
    expect(screen.getByText(/December 25, 2025/)).toBeInTheDocument();
  });

  it('should render unchecked checkbox when todo is incomplete', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('should render checked checkbox when todo is complete', () => {
    const completedTodo = { ...mockTodo, completed: 1 };
    render(<TodoCard todo={completedTodo} {...mockHandlers} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('should call onToggle when checkbox is clicked', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    
    expect(mockHandlers.onToggle).toHaveBeenCalledWith(mockTodo.id);
  });

  it('should show edit button', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const editButton = screen.getByLabelText(/Edit/);
    expect(editButton).toBeInTheDocument();
  });

  it('should show delete button', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const deleteButton = screen.getByLabelText(/Delete/);
    expect(deleteButton).toBeInTheDocument();
  });

  it('should call onDelete when delete button is clicked and confirmed', () => {
    window.confirm = jest.fn(() => true);
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const deleteButton = screen.getByLabelText(/Delete/);
    fireEvent.click(deleteButton);
    
    expect(mockHandlers.onDelete).toHaveBeenCalledWith(mockTodo.id);
  });

  it('should enter edit mode when edit button is clicked', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const editButton = screen.getByLabelText(/Edit/);
    fireEvent.click(editButton);
    
    expect(screen.getByDisplayValue('Test Todo')).toBeInTheDocument();
  });

  it('should apply completed class when todo is completed', () => {
    const completedTodo = { ...mockTodo, completed: 1 };
    const { container } = render(<TodoCard todo={completedTodo} {...mockHandlers} isLoading={false} />);
    
    const card = container.querySelector('.todo-card');
    expect(card).toHaveClass('completed');
  });

  it('should not render due date when dueDate is null', () => {
    const todoNoDate = { ...mockTodo, dueDate: null };
    render(<TodoCard todo={todoNoDate} {...mockHandlers} isLoading={false} />);
    
    expect(screen.queryByText(/Due:/)).not.toBeInTheDocument();
  });

  // --- US1: Visual Overdue Indicators ---

  describe('overdue indicator (US1)', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      // Pin "today" to 2026-04-07; yesterday (2026-04-06) is overdue
      jest.setSystemTime(new Date('2026-04-07T12:00:00.000Z'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should add todo-card--overdue class and badge for an overdue incomplete todo', () => {
      const overdueTodo = { ...mockTodo, dueDate: '2026-04-06', completed: 0 };
      const { container } = render(<TodoCard todo={overdueTodo} {...mockHandlers} isLoading={false} />);

      const card = container.querySelector('.todo-card');
      expect(card).toHaveClass('todo-card--overdue');

      const badge = screen.getByLabelText('Overdue');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass('badge--overdue');
    });

    it('should NOT show overdue class or badge when todo is on-time', () => {
      const onTimeTodo = { ...mockTodo, dueDate: '2026-04-08', completed: 0 };
      const { container } = render(<TodoCard todo={onTimeTodo} {...mockHandlers} isLoading={false} />);

      const card = container.querySelector('.todo-card');
      expect(card).not.toHaveClass('todo-card--overdue');
      expect(screen.queryByLabelText('Overdue')).not.toBeInTheDocument();
    });

    it('should NOT show overdue class or badge when todo is completed (even if past due)', () => {
      const completedOverdue = { ...mockTodo, dueDate: '2026-04-06', completed: 1 };
      const { container } = render(<TodoCard todo={completedOverdue} {...mockHandlers} isLoading={false} />);

      const card = container.querySelector('.todo-card');
      expect(card).not.toHaveClass('todo-card--overdue');
      expect(screen.queryByLabelText('Overdue')).not.toBeInTheDocument();
    });

    it('should NOT show overdue class or badge when todo has no due date', () => {
      const noDueDateTodo = { ...mockTodo, dueDate: null, completed: 0 };
      const { container } = render(<TodoCard todo={noDueDateTodo} {...mockHandlers} isLoading={false} />);

      const card = container.querySelector('.todo-card');
      expect(card).not.toHaveClass('todo-card--overdue');
      expect(screen.queryByLabelText('Overdue')).not.toBeInTheDocument();
    });
  });

  // --- US2: Dynamic overdue indicator on toggle ---

  describe('overdue indicator dynamic toggle (US2)', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2026-04-07T12:00:00.000Z'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should remove overdue badge when re-rendered with completed: 1', () => {
      const overdueTodo = { ...mockTodo, dueDate: '2026-04-06', completed: 0 };
      const { rerender } = render(<TodoCard todo={overdueTodo} {...mockHandlers} isLoading={false} />);

      expect(screen.getByLabelText('Overdue')).toBeInTheDocument();

      rerender(<TodoCard todo={{ ...overdueTodo, completed: 1 }} {...mockHandlers} isLoading={false} />);
      expect(screen.queryByLabelText('Overdue')).not.toBeInTheDocument();
    });

    it('should restore overdue badge when re-rendered with completed: 0', () => {
      const overdueTodo = { ...mockTodo, dueDate: '2026-04-06', completed: 0 };
      const { rerender } = render(<TodoCard todo={overdueTodo} {...mockHandlers} isLoading={false} />);

      rerender(<TodoCard todo={{ ...overdueTodo, completed: 1 }} {...mockHandlers} isLoading={false} />);
      expect(screen.queryByLabelText('Overdue')).not.toBeInTheDocument();

      rerender(<TodoCard todo={{ ...overdueTodo, completed: 0 }} {...mockHandlers} isLoading={false} />);
      expect(screen.getByLabelText('Overdue')).toBeInTheDocument();
    });
  });
});

import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { usePagination } from './usePagination';

describe('usePagination', () => {
  it('computes totalPages from totalItems and rowsPerPage', () => {
    const { result } = renderHook(() =>
      usePagination({ totalItems: 25, rowsPerPage: 10, page: 0, onPageChange: vi.fn() })
    );
    expect(result.current.totalPages).toBe(3);
  });

  it('returns at least 1 page when there are no items', () => {
    const { result } = renderHook(() =>
      usePagination({ totalItems: 0, rowsPerPage: 10, page: 0, onPageChange: vi.fn() })
    );
    expect(result.current.totalPages).toBe(1);
  });

  it('goToPage calls onPageChange with the requested page', () => {
    const onPageChange = vi.fn();
    const { result } = renderHook(() =>
      usePagination({ totalItems: 50, rowsPerPage: 10, page: 0, onPageChange })
    );
    result.current.goToPage(2);
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('goToPage clamps to the last valid page', () => {
    const onPageChange = vi.fn();
    const { result } = renderHook(() =>
      usePagination({ totalItems: 25, rowsPerPage: 10, page: 0, onPageChange })
    );
    // totalPages = 3 (pages 0,1,2); requesting 99 should clamp to 2
    result.current.goToPage(99);
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('goToPage clamps negative values to 0', () => {
    const onPageChange = vi.fn();
    const { result } = renderHook(() =>
      usePagination({ totalItems: 25, rowsPerPage: 10, page: 1, onPageChange })
    );
    result.current.goToPage(-5);
    expect(onPageChange).toHaveBeenCalledWith(0);
  });

  it('goToFirstPage calls onPageChange with 0', () => {
    const onPageChange = vi.fn();
    const { result } = renderHook(() =>
      usePagination({ totalItems: 50, rowsPerPage: 10, page: 3, onPageChange })
    );
    result.current.goToFirstPage();
    expect(onPageChange).toHaveBeenCalledWith(0);
  });

  it('clamps automatically when page exceeds totalPages (e.g. items shrink)', () => {
    const onPageChange = vi.fn();
    // page 5 but only 25 items / 10 per page = 3 pages (max index 2)
    renderHook(() => usePagination({ totalItems: 25, rowsPerPage: 10, page: 5, onPageChange }));
    // the clamp useEffect should fire on mount
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('does not clamp when page is within bounds', () => {
    const onPageChange = vi.fn();
    renderHook(() => usePagination({ totalItems: 25, rowsPerPage: 10, page: 1, onPageChange }));
    expect(onPageChange).not.toHaveBeenCalled();
  });
});

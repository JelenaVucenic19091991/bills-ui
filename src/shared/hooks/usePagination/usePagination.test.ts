import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePagination } from './usePagination';

describe('usePagination', () => {
  it('starts at page 0 with default rowsPerPage', () => {
    const { result } = renderHook(() => usePagination());
    expect(result.current.page).toBe(0);
    expect(result.current.rowsPerPage).toBe(10);
  });

  it('accepts a custom initial rowsPerPage', () => {
    const { result } = renderHook(() => usePagination(25));
    expect(result.current.rowsPerPage).toBe(25);
  });

  it('updates the page', () => {
    const { result } = renderHook(() => usePagination());

    act(() => result.current.setPage(3));

    expect(result.current.page).toBe(3);
  });

  it('resets page to 0 when rowsPerPage changes', () => {
    const { result } = renderHook(() => usePagination());

    act(() => result.current.setPage(5));
    act(() => result.current.setRowsPerPage(25));

    expect(result.current.rowsPerPage).toBe(25);
    expect(result.current.page).toBe(0);
  });

  it('resets page to 0 via resetPage', () => {
    const { result } = renderHook(() => usePagination());

    act(() => result.current.setPage(4));
    act(() => result.current.resetPage());

    expect(result.current.page).toBe(0);
  });
});

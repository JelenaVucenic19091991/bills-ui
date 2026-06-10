import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useBills } from './useBills';
import * as billsApi from '../services/billsApi';
import type { Bill } from '../types/bill';

const mockBills: Bill[] = [
  {
    uri: '/ie/oireachtas/bill/2026/53',
    number: '2026/53',
    billType: 'Public',
    source: 'Government',
    status: 'Current',
    sponsor: 'Minister for Finance',
    titleEn: 'Finance Bill 2026',
    titleGa: 'An Bille Airgeadais, 2026',
  },
];

beforeEach(() => {
  vi.spyOn(billsApi, 'fetchBills');
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('useBills', () => {
  it('returns loading state initially', async () => {
    vi.mocked(billsApi.fetchBills).mockResolvedValue({
      bills: mockBills,
      total: 1,
    });

    const { result } = renderHook(() => useBills(0, 10));

    expect(result.current.isLoading).toBe(true);
    expect(result.current.bills).toEqual([]);
    expect(result.current.error).toBeNull();

    await waitFor(() => expect(result.current.isLoading).toBe(false));
  });

  it('returns bills on successful fetch', async () => {
    vi.mocked(billsApi.fetchBills).mockResolvedValue({
      bills: mockBills,
      total: 1,
    });

    const { result } = renderHook(() => useBills(0, 10));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.bills).toEqual(mockBills);
    expect(result.current.total).toBe(1);
    expect(result.current.error).toBeNull();
  });

  it('returns error when fetch fails', async () => {
    vi.mocked(billsApi.fetchBills).mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useBills(0, 10));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe('Network error');
    expect(result.current.bills).toEqual([]);
  });

  it('handles non-Error rejections', async () => {
    vi.mocked(billsApi.fetchBills).mockRejectedValue('unknown error');

    const { result } = renderHook(() => useBills(0, 10));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe('Unknown error');
  });

  it('refetches when page changes', async () => {
    vi.mocked(billsApi.fetchBills).mockResolvedValue({
      bills: mockBills,
      total: 100,
    });

    const { rerender } = renderHook(({ page, rowsPerPage }) => useBills(page, rowsPerPage), {
      initialProps: { page: 0, rowsPerPage: 10 },
    });

    await waitFor(() => {
      expect(billsApi.fetchBills).toHaveBeenCalledWith({ skip: 0, limit: 10 });
    });

    rerender({ page: 1, rowsPerPage: 10 });

    await waitFor(() => {
      expect(billsApi.fetchBills).toHaveBeenCalledWith({ skip: 10, limit: 10 });
    });
  });
});

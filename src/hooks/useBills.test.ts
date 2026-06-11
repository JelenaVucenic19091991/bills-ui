import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { createElement } from 'react';
import { useBills } from './useBills';
import * as billsApi from '../services/billsApi';
import type { Bill } from '../types/bill';

const mockBills: Bill[] = [
  {
    uri: '/ie/oireachtas/bill/2026/53',
    number: '2026/53',
    billType: 'Public',
    status: 'Current',
    sponsor: 'Minister for Finance',
    titleEn: 'Finance Bill 2026',
    titleGa: 'An Bille Airgeadais, 2026',
  },
];

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  return ({ children }: { children: ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children);
}

beforeEach(() => {
  vi.spyOn(billsApi, 'fetchBills');
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('useBills', () => {
  it('returns loading state initially', () => {
    vi.mocked(billsApi.fetchBills).mockResolvedValue({ bills: mockBills, total: 1 });

    const { result } = renderHook(() => useBills(0, 10), { wrapper: createWrapper() });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.bills).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('returns bills on successful fetch', async () => {
    vi.mocked(billsApi.fetchBills).mockResolvedValue({ bills: mockBills, total: 1 });

    const { result } = renderHook(() => useBills(0, 10), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.bills).toEqual(mockBills);
    expect(result.current.total).toBe(1);
    expect(result.current.error).toBeNull();
  });

  it('returns error when fetch fails', async () => {
    vi.mocked(billsApi.fetchBills).mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useBills(0, 10), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.error).toBe('Network error'));

    expect(result.current.bills).toEqual([]);
  });

  it('passes correct skip and limit for the given page', async () => {
    vi.mocked(billsApi.fetchBills).mockResolvedValue({ bills: mockBills, total: 100 });

    renderHook(() => useBills(2, 10), { wrapper: createWrapper() });

    await waitFor(() =>
      expect(billsApi.fetchBills).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 20, limit: 10 })
      )
    );
  });

  it('passes an AbortSignal to fetchBills', async () => {
    vi.mocked(billsApi.fetchBills).mockResolvedValue({ bills: mockBills, total: 1 });

    renderHook(() => useBills(0, 10), { wrapper: createWrapper() });

    await waitFor(() =>
      expect(billsApi.fetchBills).toHaveBeenCalledWith(
        expect.objectContaining({ signal: expect.any(AbortSignal) })
      )
    );
  });

  it('does not fetch when disabled (favourites tab)', () => {
    vi.mocked(billsApi.fetchBills).mockResolvedValue({ bills: mockBills, total: 1 });

    renderHook(() => useBills(0, 10, false), { wrapper: createWrapper() });

    expect(billsApi.fetchBills).not.toHaveBeenCalled();
  });
});
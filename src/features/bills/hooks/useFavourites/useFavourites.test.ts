import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFavourites } from './useFavourites';
import type { Bill } from '@/features/bills/types/bill';

const STORAGE_KEY = 'bills-ui.favourites';

const billA: Bill = {
  uri: '/ie/oireachtas/bill/2026/53',
  number: '2026/53',
  billType: 'Public',
  status: 'Current',
  sponsor: 'Minister for Finance',
  titleEn: 'Finance Bill 2026',
  titleGa: 'An Bille Airgeadais, 2026',
};

const billB: Bill = {
  uri: '/ie/oireachtas/bill/2026/52',
  number: '2026/52',
  billType: 'Private',
  status: 'Withdrawn',
  sponsor: 'Paul Murphy',
  titleEn: 'Some Private Bill 2026',
  titleGa: 'An Bille Príobháideach, 2026',
};

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

describe('useFavourites', () => {
  it('starts with an empty list when storage is empty', () => {
    const { result } = renderHook(() => useFavourites());
    expect(result.current.favourites).toEqual([]);
    expect(result.current.favouriteUris).toEqual([]);
  });

  it('adds a bill when toggled', () => {
    const { result } = renderHook(() => useFavourites());

    act(() => result.current.toggleFavourite(billA));

    expect(result.current.favourites).toHaveLength(1);
    expect(result.current.favouriteUris).toContain(billA.uri);
  });

  it('removes a bill when toggled twice', () => {
    const { result } = renderHook(() => useFavourites());

    act(() => result.current.toggleFavourite(billA));
    act(() => result.current.toggleFavourite(billA));

    expect(result.current.favourites).toHaveLength(0);
  });

  it('keeps multiple favourites independently', () => {
    const { result } = renderHook(() => useFavourites());

    act(() => result.current.toggleFavourite(billA));
    act(() => result.current.toggleFavourite(billB));

    expect(result.current.favourites).toHaveLength(2);
  });

  it('persists favourites to localStorage', () => {
    const { result } = renderHook(() => useFavourites());

    act(() => result.current.toggleFavourite(billA));

    const stored = localStorage.getItem(STORAGE_KEY);
    expect(stored).toBeTruthy();
    expect(JSON.parse(stored!)).toHaveLength(1);
  });

  it('restores favourites from localStorage on mount', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([billA]));

    const { result } = renderHook(() => useFavourites());

    expect(result.current.favourites).toHaveLength(1);
    expect(result.current.favouriteUris).toContain(billA.uri);
  });

  it('falls back to empty list when stored data is corrupt', () => {
    localStorage.setItem(STORAGE_KEY, '{ not valid json');

    const { result } = renderHook(() => useFavourites());

    expect(result.current.favourites).toEqual([]);
  });

  it('logs a message when toggling (mock server call)', () => {
    const consoleSpy = vi.spyOn(console, 'log');
    const { result } = renderHook(() => useFavourites());

    act(() => result.current.toggleFavourite(billA));

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Favourite request dispatched')
    );
  });
});

import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useBillModal } from './useBillModal';
import type { Bill } from '@/types/bill';

const bill: Bill = {
  uri: '/ie/oireachtas/bill/2026/53',
  number: '2026/53',
  billType: 'Public',
  status: 'Current',
  sponsor: 'Minister for Finance',
  titleEn: 'Finance Bill 2026',
  titleGa: 'An Bille Airgeadais, 2026',
};

describe('useBillModal', () => {
  it('starts with no selected bill', () => {
    const { result } = renderHook(() => useBillModal());
    expect(result.current.selectedBill).toBeNull();
  });

  it('opens the modal with a bill', () => {
    const { result } = renderHook(() => useBillModal());

    act(() => result.current.openModal(bill));

    expect(result.current.selectedBill).toEqual(bill);
  });

  it('closes the modal', () => {
    const { result } = renderHook(() => useBillModal());

    act(() => result.current.openModal(bill));
    act(() => result.current.closeModal());

    expect(result.current.selectedBill).toBeNull();
  });
});

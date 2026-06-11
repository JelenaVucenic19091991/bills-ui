import { useCallback, useState } from 'react';
import type { Bill } from '../types/bill';

interface UseBillModalResult {
  selectedBill: Bill | null;
  openModal: (bill: Bill) => void;
  closeModal: () => void;
}

export function useBillModal(): UseBillModalResult {
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);

  const openModal = useCallback((bill: Bill) => {
    setSelectedBill(bill);
  }, []);

  const closeModal = useCallback(() => {
    setSelectedBill(null);
  }, []);

  return { selectedBill, openModal, closeModal };
}

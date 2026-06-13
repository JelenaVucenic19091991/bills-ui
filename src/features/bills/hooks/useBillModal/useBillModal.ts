import { useCallback, useState } from 'react';
import type { Bill } from '@/features/bills/types/bill';

interface UseBillModalResult {
  selectedBill: Bill | null;
  isOpen: boolean;
  openModal: (bill: Bill) => void;
  closeModal: () => void;
  clearBill: () => void;
}

export function useBillModal(): UseBillModalResult {
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openModal = useCallback((bill: Bill) => {
    setSelectedBill(bill);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  const clearBill = useCallback(() => {
    setSelectedBill(null);
  }, []);

  return { selectedBill, isOpen, openModal, closeModal, clearBill };
}
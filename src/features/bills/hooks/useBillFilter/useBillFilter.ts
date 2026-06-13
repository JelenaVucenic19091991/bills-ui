import { useCallback, useState } from 'react';
import { filterByBillType } from '@/features/bills/utils/billFilters';
import { ALL_FILTER } from '@/features/bills/types/bill';
import type { Bill, BillTypeFilterValue } from '@/features/bills/types/bill';

interface UseBillFilterResult {
  selectedBillType: BillTypeFilterValue;
  setBillType: (billType: BillTypeFilterValue) => void;
  applyFilter: (bills: Bill[]) => Bill[];
  resetFilter: () => void;
}

export function useBillFilter(): UseBillFilterResult {
  const [selectedBillType, setSelectedBillType] = useState<BillTypeFilterValue>(ALL_FILTER);

  const setBillType = useCallback((billType: BillTypeFilterValue) => {
    setSelectedBillType(billType);
  }, []);

  const applyFilter = useCallback(
    (bills: Bill[]) => filterByBillType(bills, selectedBillType),
    [selectedBillType]
  );

  const resetFilter = useCallback(() => {
    setSelectedBillType(ALL_FILTER);
  }, []);

  return { selectedBillType, setBillType, applyFilter, resetFilter };
}

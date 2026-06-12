import type { Bill, BillTypeFilterValue } from '@/types/bill';
import { ALL_FILTER } from '@/types/bill';

export function filterByBillType(bills: Bill[], billType: BillTypeFilterValue): Bill[] {
  if (billType === ALL_FILTER) return bills;
  return bills.filter((bill) => bill.billType === billType);
}

export function paginate<T>(items: T[], page: number, rowsPerPage: number): T[] {
  return items.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}

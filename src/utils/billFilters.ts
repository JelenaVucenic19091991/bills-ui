import type { Bill } from '../types/bill';

export function filterByBillType(bills: Bill[], billType: string): Bill[] {
  if (billType === 'all') return bills;
  return bills.filter((bill) => bill.billType === billType);
}

export function filterByFavourites(bills: Bill[], favouriteUris: string[]): Bill[] {
  return bills.filter((bill) => favouriteUris.includes(bill.uri));
}

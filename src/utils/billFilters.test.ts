import { describe, it, expect } from 'vitest';
import { filterByBillType, paginate } from './billFilters';
import { ALL_FILTER } from '../types/bill';
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
  {
    uri: '/ie/oireachtas/bill/2026/52',
    number: '2026/52',
    billType: 'Private',
    status: 'Withdrawn',
    sponsor: 'Paul Murphy',
    titleEn: 'Some Private Bill 2026',
    titleGa: 'An Bille Príobháideach, 2026',
  },
];

describe('filterByBillType', () => {
  it('returns all bills when filter is ALL_FILTER', () => {
    expect(filterByBillType(mockBills, ALL_FILTER)).toHaveLength(2);
  });

  it('filters by a specific type', () => {
    const result = filterByBillType(mockBills, 'Public');
    expect(result).toHaveLength(1);
    expect(result[0]?.billType).toBe('Public');
  });

  it('returns empty array when no bills match', () => {
    expect(filterByBillType(mockBills, 'Hybrid')).toHaveLength(0);
  });
});

describe('paginate', () => {
  const items = Array.from({ length: 25 }, (_, i) => i);

  it('returns the first page', () => {
    expect(paginate(items, 0, 10)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  it('returns the second page', () => {
    expect(paginate(items, 1, 10)).toEqual([10, 11, 12, 13, 14, 15, 16, 17, 18, 19]);
  });

  it('returns a partial last page', () => {
    expect(paginate(items, 2, 10)).toEqual([20, 21, 22, 23, 24]);
  });

  it('returns empty array for out-of-range page', () => {
    expect(paginate(items, 5, 10)).toEqual([]);
  });

  it('works with an empty array', () => {
    expect(paginate([], 0, 10)).toEqual([]);
  });
});

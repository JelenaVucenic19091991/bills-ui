import { describe, it, expect } from 'vitest';
import { filterByBillType, filterByFavourites } from './billFilters';
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
  {
    uri: '/ie/oireachtas/bill/2026/52',
    number: '2026/52',
    billType: 'Private',
    source: 'Private Member',
    status: 'Withdrawn',
    sponsor: 'Paul Murphy',
    titleEn: 'Some Private Bill 2026',
    titleGa: 'An Bille Príobháideach, 2026',
  },
];

describe('filterByBillType', () => {
  it('returns all bills when type is all', () => {
    expect(filterByBillType(mockBills, 'all')).toHaveLength(2);
  });

  it('filters by type', () => {
    const result = filterByBillType(mockBills, 'Public');
    expect(result).toHaveLength(1);
    expect(result[0]?.billType).toBe('Public');
  });

  it('returns empty array when no bills match', () => {
    expect(filterByBillType(mockBills, 'Hybrid')).toHaveLength(0);
  });
});

describe('filterByFavourites', () => {
  it('returns only favourited bills', () => {
    const result = filterByFavourites(mockBills, ['/ie/oireachtas/bill/2026/53']);
    expect(result).toHaveLength(1);
    expect(result[0]?.number).toBe('2026/53');
  });

  it('returns empty array when favouriteUris is empty', () => {
    expect(filterByFavourites(mockBills, [])).toHaveLength(0);
  });

  it('returns empty array when no bills match favouriteUris', () => {
    expect(filterByFavourites(mockBills, ['/ie/oireachtas/bill/2026/99'])).toHaveLength(0);
  });

  it('returns all matching favourited bills', () => {
    const result = filterByFavourites(mockBills, [
      '/ie/oireachtas/bill/2026/53',
      '/ie/oireachtas/bill/2026/52',
    ]);
    expect(result).toHaveLength(2);
  });
});

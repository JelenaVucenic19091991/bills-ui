import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchBills } from './billsApi';

const mockApiResponse = {
  head: { counts: { billCount: 2, resultCount: 2 } },
  results: [
    {
      bill: {
        billNo: '53',
        billYear: '2026',
        billType: 'Public',
        status: 'Current',
        shortTitleEn: 'Finance Bill 2026',
        shortTitleGa: 'An Bille Airgeadais, 2026',
        sponsors: [
          {
            sponsor: {
              as: { showAs: 'Minister for Finance' },
              by: { showAs: null },
              isPrimary: true,
            },
          },
        ],
        uri: '/ie/oireachtas/bill/2026/53',
      },
    },
    {
      bill: {
        billNo: '52',
        billYear: '2026',
        billType: 'Private',
        status: 'Withdrawn',
        shortTitleEn: 'Some Private Bill 2026',
        shortTitleGa: 'An Bille Príobháideach, 2026',
        sponsors: [
          {
            sponsor: {
              as: { showAs: null },
              by: { showAs: 'Paul Murphy' },
              isPrimary: true,
            },
          },
        ],
        uri: '/ie/oireachtas/bill/2026/52',
      },
    },
  ],
};

beforeEach(() => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockApiResponse),
    })
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('fetchBills', () => {
  it('returns mapped bills on success', async () => {
    const result = await fetchBills({ skip: 0, limit: 10 });

    expect(result.bills).toHaveLength(2);
    expect(result.bills[0]).toEqual({
      uri: '/ie/oireachtas/bill/2026/53',
      number: '2026/53',
      billType: 'Public',
      status: 'Current',
      sponsor: 'Minister for Finance',
      titleEn: 'Finance Bill 2026',
      titleGa: 'An Bille Airgeadais, 2026',
    });
  });

  it('returns correct total count', async () => {
    const result = await fetchBills({ skip: 0, limit: 10 });
    expect(result.total).toBe(2);
  });

  it('resolves sponsor from by.showAs when as.showAs is null', async () => {
    const result = await fetchBills({ skip: 0, limit: 10 });
    expect(result.bills[1]?.sponsor).toBe('Paul Murphy');
  });

  it('throws error when response is not ok', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
      })
    );

    await expect(fetchBills({ skip: 0, limit: 10 })).rejects.toThrow('Failed to fetch bills: 500');
  });

  it('constructs bill number from billYear and billNo', async () => {
    const result = await fetchBills({ skip: 0, limit: 10 });
    expect(result.bills[0]?.number).toBe('2026/53');
  });

  it('returns Unknown when sponsors array is empty', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            ...mockApiResponse,
            results: [
              {
                bill: {
                  ...mockApiResponse.results[0]!.bill,
                  sponsors: [],
                },
              },
            ],
          }),
      })
    );

    const result = await fetchBills({ skip: 0, limit: 10 });
    expect(result.bills[0]?.sponsor).toBe('Unknown');
  });

  it('throws when fetch rejects with network error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network down')));

    await expect(fetchBills({ skip: 0, limit: 10 })).rejects.toThrow('Network down');
  });
});

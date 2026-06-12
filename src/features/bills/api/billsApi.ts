import type {
  ApiBill,
  ApiBillSponsor,
  ApiResponse,
  Bill,
  BillType,
  BillStatus,
} from '@/features/bills/types/bill';

function resolveSponsor(sponsors: ApiBillSponsor[]): string {
  const primary = sponsors.find((s) => s.sponsor.isPrimary) ?? sponsors[0];
  if (!primary) return 'Unknown';
  return primary.sponsor.as?.showAs ?? primary.sponsor.by?.showAs ?? 'Unknown';
}

function mapBill(raw: ApiBill): Bill {
  return {
    uri: raw.uri,
    number: `${raw.billYear}/${raw.billNo}`,
    billType: raw.billType as BillType,
    status: raw.status as BillStatus,
    sponsor: resolveSponsor(raw.sponsors),
    titleEn: raw.shortTitleEn,
    titleGa: raw.shortTitleGa,
  };
}

export interface FetchBillsParams {
  skip: number;
  limit: number;
  signal?: AbortSignal;
}

export interface FetchBillsResult {
  bills: Bill[];
  total: number;
}

export async function fetchBills({
  skip,
  limit,
  signal,
}: FetchBillsParams): Promise<FetchBillsResult> {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  if (!BASE_URL) {
    throw new Error('VITE_API_BASE_URL is not defined. Check your .env file.');
  }

  const params = new URLSearchParams({
    limit: String(limit),
    skip: String(skip),
  });

  const response = await fetch(`${BASE_URL}/v1/legislation?${params.toString()}`, {
    signal,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch bills: ${response.status}`);
  }

  const data: ApiResponse = await response.json();
  return {
    bills: data.results.map(({ bill }) => mapBill(bill)),
    total: data.head.counts.billCount,
  };
}

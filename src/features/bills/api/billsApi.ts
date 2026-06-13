import type {
  ApiBill,
  ApiBillSponsor,
  ApiResponse,
  Bill,
  BillType,
  BillStatus,
} from '@/features/bills/types/bill';
import { BILL_TYPES, BILL_STATUSES } from '@/features/bills/types/bill';

 const BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!BASE_URL) {
  throw new Error('VITE_API_BASE_URL is not defined. Check your .env file.');
}

const ENDPOINTS = {
  legislation: '/v1/legislation',
} as const;

const UNKNOWN_SPONSOR = 'Unknown';

/**
 * Runtime guards: the API types billType/status as plain strings. Rather than
 * trusting an `as` cast blindly, we validate against the known union values and
 * fall back safely (with a warning) if the API returns something unexpected.
 */
function toBillType(value: string): BillType {
  if ((BILL_TYPES as readonly string[]).includes(value)) {
    return value as BillType;
  }
  console.warn(`Unexpected billType from API: "${value}", mapping to 'Unknown'`);
  return BILL_TYPES[0];
}

function toBillStatus(value: string): BillStatus {
  if ((BILL_STATUSES as readonly string[]).includes(value)) {
    return value as BillStatus;
  }
  console.warn(
    `Unexpected status from API: "${value}", mapping to 'Unknown'`
  );
  return BILL_STATUSES[0];
}

function resolveSponsor(sponsors: ApiBillSponsor[]): string {
  const primary = sponsors.find((s) => s.sponsor.isPrimary) ?? sponsors[0];
  if (!primary) return UNKNOWN_SPONSOR;
  return primary.sponsor.as?.showAs ?? primary.sponsor.by?.showAs ?? UNKNOWN_SPONSOR;
}

function mapBill(raw: ApiBill): Bill {
  return {
    uri: raw.uri,
    number: `${raw.billYear}/${raw.billNo}`,
    billType: toBillType(raw.billType),
    status: toBillStatus(raw.status),
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
  const params = new URLSearchParams({
    limit: String(limit),
    skip: String(skip),
  });

  const response = await fetch(`${BASE_URL}${ENDPOINTS.legislation}?${params.toString()}`, {
    signal,
  });

  if (!response.ok) {
    throw new ApiError(response.status, `Failed to fetch bills: ${response.status}`);
  }

  const data: ApiResponse = await response.json();
  return {
    bills: data.results.map(({ bill }) => mapBill(bill)),
    total: data.head.counts.billCount,
  };
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
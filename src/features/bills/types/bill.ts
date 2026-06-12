export interface ApiBillSponsor {
  sponsor: {
    as: { showAs: string | null };
    by: { showAs: string | null };
    isPrimary: boolean;
  };
}

export interface ApiBill {
  billNo: string;
  billYear: string;
  billType: string;
  source: string;
  status: string;
  shortTitleEn: string;
  shortTitleGa: string;
  sponsors: ApiBillSponsor[];
  uri: string;
}

export interface ApiResponse {
  head: {
    counts: {
      billCount: number;
      resultCount: number;
    };
  };
  results: Array<{ bill: ApiBill }>;
}

export const BILL_TYPES = ['Public', 'Private', 'Hybrid'] as const;
export type BillType = (typeof BILL_TYPES)[number];

export const BILL_STATUSES = [
  'Current',
  'Withdrawn',
  'Enacted',
  'Rejected',
  'Defeated',
  'Lapsed',
] as const;
export type BillStatus = (typeof BILL_STATUSES)[number];

export const ALL_FILTER = 'all';
export type BillTypeFilterValue = BillType | typeof ALL_FILTER;

export interface Bill {
  uri: string;
  number: string;
  billType: BillType;
  status: BillStatus;
  sponsor: string;
  titleEn: string;
  titleGa: string;
}

export type TabValue = 'all' | 'favourites';


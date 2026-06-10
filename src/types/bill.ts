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

export interface Bill {
  uri: string;
  number: string;
  billType: string;
  source: string;
  status: string; // "Current" | "Withdrawn" | "Enacted" | "Rejected" | "Defeated" | "Lapsed"
  sponsor: string;
  titleEn: string;
  titleGa: string;
}

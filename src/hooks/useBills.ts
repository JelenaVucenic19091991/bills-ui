import { useEffect, useState } from 'react';
import { fetchBills } from '../services/billsApi';
import type { Bill } from '../types/bill';

interface UseBillsResult {
  bills: Bill[];
  total: number;
  isLoading: boolean;
  error: string | null;
}

export function useBills(page: number, rowsPerPage: number): UseBillsResult {
  const [bills, setBills] = useState<Bill[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchBills({ skip: page * rowsPerPage, limit: rowsPerPage })
      .then((result) => {
        if (!cancelled) {
          setBills(result.bills);
          setTotal(result.total);
          setIsLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Unknown error');
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [page, rowsPerPage]);

  return { bills, total, isLoading, error };
}

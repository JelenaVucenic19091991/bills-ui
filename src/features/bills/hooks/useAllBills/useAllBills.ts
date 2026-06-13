import { useQuery } from '@tanstack/react-query';
import { fetchAllBills } from '@/features/bills/api/billsApi';
import { billsQueryKeys } from '@/features/bills/api/billsQueries';
import type { Bill } from '@/features/bills/types/bill';

interface UseAllBillsResult {
  allBills: Bill[];
  isLoading: boolean;
  isFetching: boolean;
  error: string | null;
}

/**
 * Fetches the full bills dataset for client-side filtering. Enabled only when a
 * filter is active, so the ~6500-record fetch never runs unless the user needs it.
 * Cached with a long staleTime since the dataset is effectively static per session.
 */
export function useAllBills(enabled: boolean): UseAllBillsResult {
  const query = useQuery({
    queryKey: billsQueryKeys.allBills(),
    queryFn: ({ signal }) => fetchAllBills(signal),
    enabled,
    staleTime: Infinity, // static dataset — fetch once per session, never refetch
  });

  return {
    allBills: query.data ?? [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error
      ? query.error instanceof Error
        ? query.error.message
        : String(query.error)
      : null,
  };
}
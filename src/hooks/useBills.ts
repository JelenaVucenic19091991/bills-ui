import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { fetchBills } from '@/services/billsApi';
import type { Bill } from '@/types/bill';

interface UseBillsResult {
  bills: Bill[];
  total: number;
  isLoading: boolean;
  isFetching: boolean;
  error: string | null;
  refetch: () => Promise<unknown>;
}

export function useBills(page: number, rowsPerPage: number, enabled = true): UseBillsResult {
  const query = useQuery({
    queryKey: ['bills', page, rowsPerPage],
    queryFn: ({ signal }) => fetchBills({ skip: page * rowsPerPage, limit: rowsPerPage, signal }),
    placeholderData: keepPreviousData,
    enabled,
  });

  return {
    bills: query.data?.bills ?? [],
    total: query.data?.total ?? 0,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error
      ? query.error instanceof Error
        ? query.error.message
        : String(query.error)
      : null,
    refetch: query.refetch,
  };
}

import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { billsQueryOptions } from '@/features/bills/api/billsQueries';
import type { Bill } from '@/features/bills/types/bill';

interface UseBillsResult {
  bills: Bill[];
  total: number;
  isLoading: boolean;
  isFetching: boolean;
  isPlaceholderData: boolean;
  error: string | null;
  refetch: () => void;
}

export function useBills(page: number, rowsPerPage: number, enabled = true): UseBillsResult {
  const queryClient = useQueryClient();

  const query = useQuery({
    ...billsQueryOptions(page, rowsPerPage),
    enabled,
  });

  // Prefetch the next page so pagination feels instant.
  // Combined with keepPreviousData, the user never sees an empty state between pages.
  const total = query.data?.total ?? 0;
  const hasNextPage = (page + 1) * rowsPerPage < total;

  useEffect(() => {
    if (!enabled || !hasNextPage) return;
    queryClient.prefetchQuery(billsQueryOptions(page + 1, rowsPerPage));
  }, [enabled, hasNextPage, page, rowsPerPage, queryClient]);

  return {
    bills: query.data?.bills ?? [],
    total,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isPlaceholderData: query.isPlaceholderData,
    error: query.error
      ? query.error instanceof Error
        ? query.error.message
        : String(query.error)
      : null,
    refetch: () => { void query.refetch(); },
  };
}
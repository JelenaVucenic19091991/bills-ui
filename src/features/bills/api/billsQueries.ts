import { keepPreviousData } from '@tanstack/react-query';
import { fetchBills } from '@/features/bills/api/billsApi';

/**
 * Centralized query keys for bills. A factory prevents typos and makes
 * cache invalidation explicit and consistent across the feature.
 */
export const billsQueryKeys = {
  all: ['bills'] as const,
  page: (page: number, rowsPerPage: number) => ['bills', page, rowsPerPage] as const,
};

/**
 * Shared query options for a bills page. Used by both useQuery and
 * prefetchQuery so the fetch logic stays DRY.
 */
export function billsQueryOptions(page: number, rowsPerPage: number) {
  return {
    queryKey: billsQueryKeys.page(page, rowsPerPage),
    queryFn: ({ signal }: { signal: AbortSignal }) =>
      fetchBills({ skip: page * rowsPerPage, limit: rowsPerPage, signal }),
    placeholderData: keepPreviousData,
  };
}
import { ApiError } from '@/features/bills/api/billsApi';
import { QueryClient } from '@tanstack/react-query';

// Cache timing constants
export const STALE_TIME = 5 * 60 * 1000; // 5 minutes
export const GC_TIME = 10 * 60 * 1000; // 10 minutes

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: STALE_TIME,
      gcTime: GC_TIME,
      retry: (failureCount, error) => {
        if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
          return false;
        }
        return failureCount < 1;
      },
      refetchOnWindowFocus: false,
    },
  },
});
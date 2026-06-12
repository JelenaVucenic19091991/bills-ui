import { useCallback, useEffect, useMemo } from 'react';

interface UsePaginationParams {
  totalItems: number;
  rowsPerPage: number;
  page: number;
  onPageChange: (page: number) => void;
}

interface UsePaginationResult {
  totalPages: number;
  goToPage: (page: number) => void;
  goToFirstPage: () => void;
}

/**
 * Pure pagination logic: derives totalPages and keeps the current page
 * within valid bounds. State (page/rowsPerPage) is owned by the caller,
 * so this hook stays presentational and reusable across any list.
 */
export function usePagination({
  totalItems,
  rowsPerPage,
  page,
  onPageChange,
}: UsePaginationParams): UsePaginationResult {
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(totalItems / rowsPerPage)),
    [totalItems, rowsPerPage]
  );

  // Clamp: if totalItems shrinks below the current page, snap back.
  useEffect(() => {
    const maxPage = totalPages - 1;
    if (page > maxPage) {
      onPageChange(maxPage);
    }
  }, [page, totalPages, onPageChange]);

  const goToPage = useCallback(
    (next: number) => {
      const maxPage = totalPages - 1;
      onPageChange(Math.min(Math.max(0, next), maxPage));
    },
    [totalPages, onPageChange]
  );

  const goToFirstPage = useCallback(() => onPageChange(0), [onPageChange]);

  return { totalPages, goToPage, goToFirstPage };
}
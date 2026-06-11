import { useCallback, useState } from 'react';

interface UsePaginationResult {
  page: number;
  rowsPerPage: number;
  setPage: (page: number) => void;
  setRowsPerPage: (rowsPerPage: number) => void;
  resetPage: () => void;
}

export function usePagination(initialRowsPerPage = 10): UsePaginationResult {
  const [page, setPageState] = useState(0);
  const [rowsPerPage, setRowsPerPageState] = useState(initialRowsPerPage);

  const setPage = useCallback((newPage: number) => {
    setPageState(newPage);
  }, []);

  const setRowsPerPage = useCallback((newRowsPerPage: number) => {
    setRowsPerPageState(newRowsPerPage);
    setPageState(0);
  }, []);

  const resetPage = useCallback(() => {
    setPageState(0);
  }, []);

  return { page, rowsPerPage, setPage, setRowsPerPage, resetPage };
}

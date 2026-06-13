import { useCallback, useMemo, useState } from 'react';
import type { SyntheticEvent } from 'react';
import { useBills } from '@/features/bills/hooks/useBills';
import { useAllBills } from '@/features/bills/hooks/useAllBills';
import { useFavourites } from '@/features/bills/hooks/useFavourites';
import { useBillFilter } from '@/features/bills/hooks/useBillFilter';
import { useBillModal } from '@/features/bills/hooks/useBillModal';
import { usePagination } from '@/shared/hooks/usePagination';
import { paginate } from '@/features/bills/utils/billFilters';
import { ROWS_PER_PAGE_DEFAULT } from '@/features/bills/constants';
import { ALL_FILTER } from '@/features/bills/types/bill';
import type { Bill, BillTypeFilterValue, TabValue } from '@/features/bills/types/bill';

interface UseBillsPageStateResult {
  activeTab: TabValue;
  isFavouritesTab: boolean;
  onTabChange: (event: SyntheticEvent, value: TabValue) => void;
  displayedBills: Bill[];
  totalCount: number;
  isLoading: boolean;
  isFetching: boolean;
  error: string | null;
  refetch: () => void;
  selectedBillType: BillTypeFilterValue;
  onBillTypeChange: (billType: BillTypeFilterValue) => void;
  page: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
  favouriteUris: string[];
  onFavouriteToggle: (uri: string) => void;
  selectedBill: Bill | null;
  onRowClick: (bill: Bill) => void;
  onCloseModal: () => void;
  isPlaceholderData: boolean;
  onModalExited: () => void;
  isModalOpen: boolean;
  hasFilter: boolean;
}

export function useBillsPageState(): UseBillsPageStateResult {
  const [activeTab, setActiveTab] = useState<TabValue>('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPageState] = useState(ROWS_PER_PAGE_DEFAULT);

  const isFavouritesTab = activeTab === 'favourites';

  const { favourites, favouriteUris, toggleFavourite } = useFavourites();
  const { selectedBillType, setBillType, applyFilter, resetFilter } = useBillFilter();
  const { selectedBill, isOpen, openModal, closeModal, clearBill } = useBillModal();

  // A bill-type filter is active only on the All Bills tab with a non-default type.
  const hasFilter = !isFavouritesTab && selectedBillType !== ALL_FILTER;

  // Server-paginated query: active on All Bills tab when NO filter is applied.
  const {
    bills,
    total,
    isLoading: isServerLoading,
    isFetching,
    isPlaceholderData,
    error: serverError,
    refetch,
  } = useBills(page, rowsPerPage, !isFavouritesTab && !hasFilter);

  // Full-dataset query: active only when a filter is applied (fetched once, cached).
  const {
    allBills,
    isLoading: isAllLoading,
    isFetching: isAllFetching,
    error: allError,
  } = useAllBills(hasFilter);

  // Filtered + client-paginated result, computed only when a filter is active.
  const filteredAllBills = useMemo(
    () => (hasFilter ? applyFilter(allBills) : []),
    [hasFilter, applyFilter, allBills]
  );

  const totalCount = useMemo(() => {
    if (isFavouritesTab) return favourites.length;
    if (hasFilter) return filteredAllBills.length;
    return total;
  }, [isFavouritesTab, hasFilter, favourites.length, filteredAllBills.length, total]);

  const { goToFirstPage } = usePagination({
    totalItems: totalCount,
    rowsPerPage,
    page,
    onPageChange: setPage,
  });

  const displayedBills = useMemo(() => {
    if (isFavouritesTab) {
      return paginate(favourites, page, rowsPerPage);
    }
    if (hasFilter) {
      return paginate(filteredAllBills, page, rowsPerPage);
    }
    return bills;
  }, [isFavouritesTab, hasFilter, favourites, filteredAllBills, bills, page, rowsPerPage]);

  // Loading/fetching/error reflect whichever source is active.
  const isLoading = hasFilter ? isAllLoading : isServerLoading;
  const isFetchingState = hasFilter ? isAllFetching : isFetching;
  const error = hasFilter ? allError : serverError;

  const onTabChange = useCallback(
    (_: SyntheticEvent, value: TabValue) => {
      setActiveTab(value);
      goToFirstPage();
      resetFilter();
    },
    [goToFirstPage, resetFilter]
  );

  const onBillTypeChange = useCallback(
    (billType: BillTypeFilterValue) => {
      setBillType(billType);
      goToFirstPage();
    },
    [setBillType, goToFirstPage]
  );

  const onRowsPerPageChange = useCallback(
    (newRowsPerPage: number) => {
      setRowsPerPageState(newRowsPerPage);
      goToFirstPage();
    },
    [goToFirstPage]
  );

  const onFavouriteToggle = useCallback(
    (uri: string) => {
      const bill =
        bills.find((b) => b.uri === uri) ??
        allBills.find((b) => b.uri === uri) ??
        favourites.find((b) => b.uri === uri);
      if (bill) {
        toggleFavourite(bill);
      }
    },
    [bills, allBills, favourites, toggleFavourite]
  );

  return {
    activeTab,
    isFavouritesTab,
    onTabChange,
    displayedBills,
    totalCount,
    isLoading,
    isFetching: isFetchingState,
    error,
    refetch,
    selectedBillType,
    onBillTypeChange,
    page,
    rowsPerPage,
    onPageChange: setPage,
    onRowsPerPageChange,
    favouriteUris,
    onFavouriteToggle,
    selectedBill,
    onRowClick: openModal,
    onCloseModal: closeModal,
    isPlaceholderData,
    onModalExited: clearBill,
    isModalOpen: isOpen,
    hasFilter,
  };
}
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Box, Button, LinearProgress, Tab, Tabs } from '@mui/material';
import type { SyntheticEvent } from 'react';
import { useBills } from '../hooks/useBills';
import { useFavourites } from '../hooks/useFavourites';
import { usePagination } from '../hooks/usePagination';
import { useBillModal } from '../hooks/useBillModal';
import { BillsTable, BillsTableSkeleton } from '../components/BillsTable';
import { BillTypeFilter } from '../components/BillTypeFilter';
import { BillDetailsModal } from '../components/BillDetailsModal';
import { filterByBillType, paginate } from '../utils/billFilters';
import { ALL_FILTER } from '../types/bill';
import type { BillTypeFilterValue } from '../types/bill';

type TabValue = 'all' | 'favourites';

export function BillsPage(): React.ReactElement {
  const [activeTab, setActiveTab] = useState<TabValue>('all');
  const [selectedBillType, setSelectedBillType] =
    useState<BillTypeFilterValue>(ALL_FILTER);

  const { page, rowsPerPage, setPage, setRowsPerPage, resetPage } = usePagination();
  const { favourites, favouriteUris, toggleFavourite } = useFavourites();
  const { selectedBill, openModal, closeModal } = useBillModal();

  const isFavouritesTab = activeTab === 'favourites';

  const { bills, total, isLoading, isFetching, error, refetch } = useBills(
    page,
    rowsPerPage,
    !isFavouritesTab
  );

  const paginatedFavourites = useMemo(
    () => paginate(favourites, page, rowsPerPage),
    [favourites, page, rowsPerPage]
  );

  const displayedBills = useMemo(() => {
    if (isFavouritesTab) {
      return paginatedFavourites;
    }
    return filterByBillType(bills, selectedBillType);
  }, [isFavouritesTab, paginatedFavourites, bills, selectedBillType]);

  const totalCount = isFavouritesTab ? favourites.length : total;

  useEffect(() => {
    const maxPage = Math.max(0, Math.ceil(totalCount / rowsPerPage) - 1);
    if (page > maxPage) {
      setPage(maxPage);
    }
  }, [totalCount, rowsPerPage, page, setPage]);

  const handleTabChange = useCallback(
    (_: SyntheticEvent, value: TabValue) => {
      setActiveTab(value);
      resetPage();
    },
    [resetPage]
  );

  const handleBillTypeFilterChange = useCallback(
    (billType: BillTypeFilterValue) => {
      setSelectedBillType(billType);
      resetPage();
    },
    [resetPage]
  );

  const handleFavouriteToggle = useCallback(
    (uri: string) => {
      const bill =
        bills.find((b) => b.uri === uri) ?? favourites.find((b) => b.uri === uri);
      if (bill) {
        toggleFavourite(bill);
      }
    },
    [bills, favourites, toggleFavourite]
  );

  if (isLoading) return <BillsTableSkeleton rowsPerPage={rowsPerPage} />;

  if (error) {
    return (
      <Alert
        severity="error"
        sx={{ mt: 2 }}
        action={
          <Button color="inherit" size="small" onClick={() => refetch()}>
            Retry
          </Button>
        }
      >
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab label="All Bills" value="all" />
        <Tab label="Favourite Bills" value="favourites" />
      </Tabs>

      {!isFavouritesTab && (
        <Box sx={{ mb: 3 }}>
          <BillTypeFilter
            selectedBillType={selectedBillType}
            onChange={handleBillTypeFilterChange}
          />
        </Box>
      )}

      <Box sx={{ position: 'relative' }}>
        {isFetching && !isLoading && (
          <LinearProgress sx={{ position: 'absolute', top: 0, left: 0, right: 0 }} />
        )}
        <BillsTable
          bills={displayedBills}
          favouriteUris={favouriteUris}
          totalCount={totalCount}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={setPage}
          onRowsPerPageChange={setRowsPerPage}
          onRowClick={openModal}
          onFavouriteToggle={handleFavouriteToggle}
          emptyMessage={
            isFavouritesTab
              ? 'No favourite bills yet. Click the star icon to add bills to your favourites.'
              : 'No bills match the selected filter.'
          }
        />
      </Box>

      {selectedBill !== null && (
        <BillDetailsModal
          key={selectedBill.uri}
          bill={selectedBill}
          open
          onClose={closeModal}
        />
      )}
    </Box>
  );
}
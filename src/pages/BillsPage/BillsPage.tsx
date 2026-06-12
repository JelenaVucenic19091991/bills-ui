import { Alert, Box, Button, LinearProgress, Tab, Tabs } from '@mui/material';
import { useBillsPageState } from '@/features/bills/hooks/useBillsPageState';
import { BillsTable, BillsTableSkeleton } from '@/features/bills/components/BillsTable';
import { BillTypeFilter } from '@/features/bills/components/BillTypeFilter';
import { BillDetailsModal } from '@/features/bills/components/BillDetailsModal';

export function BillsPage(): React.ReactElement {
  const {
    activeTab,
    isFavouritesTab,
    onTabChange,
    displayedBills,
    totalCount,
    isLoading,
    isFetching,
    error,
    refetch,
    selectedBillType,
    onBillTypeChange,
    page,
    rowsPerPage,
    onPageChange,
    onRowsPerPageChange,
    favouriteUris,
    onFavouriteToggle,
    selectedBill,
    onRowClick,
    onCloseModal,
  } = useBillsPageState();

  return (
    <Box>
      <Tabs
        value={activeTab}
        onChange={onTabChange}
        sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab label="All Bills" value="all" />
        <Tab label="Favourite Bills" value="favourites" />
      </Tabs>

      {!isFavouritesTab && (
        <Box sx={{ mb: 3 }}>
          <BillTypeFilter selectedBillType={selectedBillType} onChange={onBillTypeChange} />
        </Box>
      )}

      <Box sx={{ position: 'relative' }} aria-live="polite">
        {isFetching && !isLoading && (
          <LinearProgress sx={{ position: 'absolute', top: 0, left: 0, right: 0 }} />
        )}

        {isLoading ? (
          <BillsTableSkeleton rowsPerPage={rowsPerPage} />
        ) : error ? (
          <Alert
            severity="error"
            action={
              <Button color="inherit" size="small" onClick={refetch}>
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        ) : (
          <BillsTable
            bills={displayedBills}
            favouriteUris={favouriteUris}
            totalCount={totalCount}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onPageChange}
            onRowsPerPageChange={onRowsPerPageChange}
            onRowClick={onRowClick}
            onFavouriteToggle={onFavouriteToggle}
            emptyMessage={
              isFavouritesTab
                ? 'No favourite bills yet. Click the star icon to add bills to your favourites.'
                : 'No bills match the selected filter.'
            }
          />
        )}
      </Box>

      {selectedBill !== null && (
        <BillDetailsModal key={selectedBill.uri} bill={selectedBill} open onClose={onCloseModal} />
      )}
    </Box>
  );
}
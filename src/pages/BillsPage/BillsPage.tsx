import { Alert, Box, Button, LinearProgress, Tab, Tabs } from '@mui/material';
import { STRINGS } from '@/shared/constants/strings';
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
    isPlaceholderData,
    onRowClick,
    onCloseModal,
    onModalExited,
  } = useBillsPageState();

  return (
    <Box>
      <Tabs
        value={activeTab}
        onChange={onTabChange}
        sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab label={STRINGS.tabs.allBills} value="all" />
        <Tab label={STRINGS.tabs.favouriteBills} value="favourites" />
      </Tabs>

      {!isFavouritesTab && (
        <Box sx={{ mb: 3 }}>
          <BillTypeFilter selectedBillType={selectedBillType} onChange={onBillTypeChange} />
        </Box>
      )}

      <Box sx={{ position: 'relative' }}>
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
                {STRINGS.actions.retry}
              </Button>
            }
          >
            {error}
          </Alert>
        ) : (
          <Box
            sx={{
              opacity: isPlaceholderData ? 0.6 : 1,
              transition: 'opacity 0.2s',
            }}
          >
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
                isFavouritesTab ? STRINGS.table.emptyFavourites : STRINGS.table.emptyAllBills
              }
            />
          </Box>
        )}
      </Box>

      <BillDetailsModal
        bill={selectedBill}
        open={selectedBill !== null}
        onClose={onCloseModal}
        onExited={onModalExited}
      />
    </Box>
  );
}
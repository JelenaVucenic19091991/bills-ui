import type { ReactElement } from 'react';
import { Alert, Box, Button, LinearProgress, Tab, Tabs } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { STRINGS } from '@/shared/constants/strings';
import { useBillsPageState } from '@/features/bills/hooks/useBillsPageState';
import { BillsTable, BillsTableSkeleton } from '@/features/bills/components/BillsTable';
import { BillTypeFilter } from '@/features/bills/components/BillTypeFilter';
import { BillDetailsModal } from '@/features/bills/components/BillDetailsModal';

export function BillsPage(): ReactElement {
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
    isModalOpen,
    isPlaceholderData,
    onRowClick,
    onCloseModal,
    onModalExited,
  } = useBillsPageState();

  const statusMessage = isLoading
    ? STRINGS.status.loading
    : error
      ? STRINGS.status.error
      : STRINGS.status.loaded(totalCount);

  return (
    <Box>
      <Tabs
        value={activeTab}
        onChange={onTabChange}
        aria-label={STRINGS.tabs.ariaLabel}
        sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab
          label={STRINGS.tabs.allBills}
          value="all"
          id="bills-tab-all"
          aria-controls="bills-tabpanel"
        />
        <Tab
          label={STRINGS.tabs.favouriteBills}
          value="favourites"
          id="bills-tab-favourites"
          aria-controls="bills-tabpanel"
        />
      </Tabs>

      {!isFavouritesTab && (
        <Box sx={{ mb: 3 }}>
          <BillTypeFilter selectedBillType={selectedBillType} onChange={onBillTypeChange} />
        </Box>
      )}

      <Box
        sx={{ position: 'relative' }}
        role="tabpanel"
        id="bills-tabpanel"
        aria-labelledby={activeTab === 'all' ? 'bills-tab-all' : 'bills-tab-favourites'}
      >
        <Box role="status" aria-live="polite" sx={visuallyHidden}>
          {statusMessage}
        </Box>

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
            {STRINGS.status.error}
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
        open={isModalOpen}
        onClose={onCloseModal}
        onExited={onModalExited}
      />
    </Box>
  );
}
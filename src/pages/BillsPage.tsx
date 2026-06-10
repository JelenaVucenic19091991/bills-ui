import { useCallback, useMemo, useState } from 'react';
import { Alert, Box, Tab, Tabs } from '@mui/material';
import type { SyntheticEvent } from 'react';
import { useBills } from '../hooks/useBills';
import { BillsTable, BillsTableSkeleton } from '../components/BillsTable';
import { BillTypeFilter } from '../components/BillTypeFilter';
import { filterByBillType } from '../utils/billFilters';
import type { Bill } from '../types/bill';
import { BillDetailsModal } from '../components/BillDetailsModal';

type TabValue = 'all' | 'favourites';

export function BillsPage(): React.ReactElement {
  const [activeTab, setActiveTab] = useState<TabValue>('all');
  const [selectedBillType, setSelectedBillType] = useState<string>('all');
  const [favouriteBills, setFavouriteBills] = useState<Bill[]>([]);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { bills, total, isLoading, error } = useBills(page, rowsPerPage);

  const displayedBills = useMemo(() => {
    if (activeTab === 'favourites') {
      return favouriteBills;
    }
    return filterByBillType(bills, selectedBillType);
  }, [bills, activeTab, favouriteBills, selectedBillType]);

  const favouriteUris = useMemo(() => favouriteBills.map((b) => b.uri), [favouriteBills]);

  const handleTabChange = useCallback((_: SyntheticEvent, value: TabValue) => {
    setActiveTab(value);
    setPage(0);
  }, []);

  const handleBillTypeFilterChange = useCallback((billType: string) => {
    setSelectedBillType(billType);
    setPage(0);
  }, []);

  const handleRowClick = useCallback((bill: Bill) => {
    setSelectedBill(bill);
  }, []);

  const handleModalClose = useCallback(() => {
    setSelectedBill(null);
  }, []);

  const handleFavouriteToggle = useCallback(
    (uri: string) => {
      setFavouriteBills((prev) => {
        const isFav = prev.some((b) => b.uri === uri);
        console.log(`Favourite request dispatched: bill ${uri} → ${isFav ? 'removed' : 'added'}`);
        if (isFav) {
          return prev.filter((b) => b.uri !== uri);
        }
        const bill = bills.find((b) => b.uri === uri) ?? prev.find((b) => b.uri === uri);
        return bill ? [...prev, bill] : prev;
      });
    },
    [bills]
  );

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handleRowsPerPageChange = useCallback((newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  }, []);

  if (isLoading) return <BillsTableSkeleton />;

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
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

      {activeTab === 'all' && (
        <Box sx={{ mb: 3 }}>
          <BillTypeFilter
            selectedBillType={selectedBillType}
            onChange={handleBillTypeFilterChange}
          />
        </Box>
      )}

      <BillsTable
        bills={displayedBills}
        favouriteUris={favouriteUris}
        totalCount={activeTab === 'favourites' ? favouriteBills.length : total}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onRowClick={handleRowClick}
        onFavouriteToggle={handleFavouriteToggle}
        emptyMessage={
          activeTab === 'favourites'
            ? 'No favourite bills yet. Click the star icon to add bills to your favourites.'
            : 'No bills match the selected filter.'
        }
      />

      {selectedBill !== null && (
        <BillDetailsModal
          key={selectedBill.uri}
          bill={selectedBill}
          open
          onClose={handleModalClose}
        />
      )}
    </Box>
  );
}

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import { STRINGS } from '@/shared/constants/strings';
import { BILL_TABLE_COLUMNS, ROWS_PER_PAGE_OPTIONS } from '@/features/bills/constants';
import { BillRow } from '@/features/bills/components/BillRow';
import type { Bill } from '@/features/bills/types/bill';

interface BillsTableProps {
  bills: Bill[];
  favouriteUris: string[];
  totalCount: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
  onRowClick: (bill: Bill) => void;
  onFavouriteToggle: (uri: string) => void;
  emptyMessage?: string;
}

export function BillsTable({
  bills,
  favouriteUris,
  totalCount,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onRowClick,
  onFavouriteToggle,
  emptyMessage = STRINGS.table.emptyAllBills,
}: BillsTableProps): React.ReactElement {
  return (
    <Paper elevation={1}>
      <TableContainer sx={{ overflowX: 'auto' }}>
        <Table aria-label={STRINGS.table.ariaLabel}>
          <TableHead>
            <TableRow>
              {BILL_TABLE_COLUMNS.map((col) => (
                <TableCell key={col.key} align={col.align}>{col.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {bills.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                  <Typography color="text.secondary">{emptyMessage}</Typography>
                </TableCell>
              </TableRow>
            ) : (
              bills.map((bill) => (
                <BillRow
                  key={bill.uri}
                  bill={bill}
                  isFavourite={favouriteUris.includes(bill.uri)}
                  onRowClick={onRowClick}
                  onFavouriteToggle={onFavouriteToggle}
                />
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={totalCount}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[...ROWS_PER_PAGE_OPTIONS]}
        onPageChange={(_, newPage) => onPageChange(newPage)}
        onRowsPerPageChange={(e) => onRowsPerPageChange(parseInt(e.target.value, 10))}
      />
    </Paper>
  );
}
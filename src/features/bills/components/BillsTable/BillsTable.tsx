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
  emptyMessage = 'No bills match the selected filter.',
}: BillsTableProps): React.ReactElement {
  return (
    <Paper elevation={1}>
      <TableContainer sx={{ overflowX: 'auto' }}>
        <Table aria-label="Bills table">
          <TableHead>
            <TableRow>
              <TableCell>Bill Number</TableCell>
              <TableCell>Bill Type</TableCell>
              <TableCell>Bill Status</TableCell>
              <TableCell>Sponsor</TableCell>
              <TableCell align="center">Favourite</TableCell>
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
        rowsPerPageOptions={[10, 25, 50]}
        onPageChange={(_, newPage) => onPageChange(newPage)}
        onRowsPerPageChange={(e) => onRowsPerPageChange(parseInt(e.target.value, 10))}
      />
    </Paper>
  );
}
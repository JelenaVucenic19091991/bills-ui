import {
  Chip,
  IconButton,
  Link,
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
import type { ChipProps } from '@mui/material';
import { Star, StarBorder } from '@mui/icons-material';
import type { Bill, BillStatus  } from '../../types/bill';

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

const STATUS_COLORS: Record<BillStatus, ChipProps['color']> = {
  Current: 'success',
  Withdrawn: 'default',
  Enacted: 'primary',
  Rejected: 'error',
  Defeated: 'error',
  Lapsed: 'warning',
};

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
              bills.map((bill) => {
                const isFavourite = favouriteUris.includes(bill.uri);
                return (
                  <TableRow
                    key={bill.uri}
                    hover
                    onClick={() => onRowClick(bill)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell>
                      <Link
                        component="button"
                        underline="hover"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRowClick(bill);
                        }}
                        aria-label={`View details for bill ${bill.number}`}
                        sx={{ font: 'inherit', color: 'inherit' }}
                      >
                        {bill.number}
                      </Link>
                    </TableCell>
                    <TableCell>{bill.billType}</TableCell>
                    <TableCell>
                      <Chip
                        label={bill.status}
                        size="small"
                        color={STATUS_COLORS[bill.status] ?? 'default'}
                      />
                    </TableCell>
                    <TableCell>{bill.sponsor}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        aria-label={
                          isFavourite
                            ? `Remove ${bill.number} from favourites`
                            : `Add ${bill.number} to favourites`
                        }
                        onClick={(e) => {
                          e.stopPropagation();
                          onFavouriteToggle(bill.uri);
                        }}
                        size="small"
                      >
                        {isFavourite ? <Star color="warning" /> : <StarBorder />}
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })
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
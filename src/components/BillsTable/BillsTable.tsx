import {
  Box,
  Chip,
  IconButton,
  Paper,
  Skeleton,
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
import type { Bill } from '../../types/bill';

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

const STATUS_COLORS: Record<string, ChipProps['color']> = {
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
                    tabIndex={0}
                    role="button"
                    onClick={() => onRowClick(bill)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onRowClick(bill);
                      }
                    }}
                    sx={{
                      cursor: 'pointer',
                      '&:focus-visible': {
                        boxShadow: 'inset 0 0 0 2px #1B4F72',
                      },
                    }}
                  >
                    <TableCell>{bill.number}</TableCell>
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
                        aria-label={isFavourite ? 'Remove from favourites' : 'Add to favourites'}
                        onClick={(e) => {
                          e.stopPropagation();
                          onFavouriteToggle(bill.uri);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.stopPropagation();
                          }
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

export function BillsTableSkeleton(): React.ReactElement {
  return (
    <Paper elevation={1}>
      <Box sx={{ p: 2 }}>
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} height={52} sx={{ mb: 1 }} />
        ))}
      </Box>
    </Paper>
  );
}

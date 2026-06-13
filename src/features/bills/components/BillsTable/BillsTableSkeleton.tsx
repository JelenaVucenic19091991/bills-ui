import {
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { STRINGS } from '@/shared/constants/strings';
import { BILL_TABLE_COLUMNS, ROWS_PER_PAGE_DEFAULT } from '@/features/bills/constants';

interface BillsTableSkeletonProps {
  rowsPerPage?: number;
}

export function BillsTableSkeleton({
  rowsPerPage = ROWS_PER_PAGE_DEFAULT,
}: BillsTableSkeletonProps): React.ReactElement {
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
            {Array.from({ length: rowsPerPage }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton variant="text" width={80} />
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" width={60} />
                </TableCell>
                <TableCell>
                  <Skeleton variant="rounded" width={70} height={24} />
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" width={140} />
                </TableCell>
                <TableCell align="center">
                  <Skeleton variant="circular" width={24} height={24} sx={{ mx: 'auto' }} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
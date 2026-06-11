import { Box, Paper, Skeleton } from '@mui/material';

interface BillsTableSkeletonProps {
  rowsPerPage?: number;
}

export function BillsTableSkeleton({
  rowsPerPage = 10,
}: BillsTableSkeletonProps): React.ReactElement {
  return (
    <Paper elevation={1}>
      <Box sx={{ p: 2 }}>
        {Array.from({ length: rowsPerPage }).map((_, i) => (
          <Skeleton key={i} height={52} sx={{ mb: 1 }} />
        ))}
      </Box>
    </Paper>
  );
}
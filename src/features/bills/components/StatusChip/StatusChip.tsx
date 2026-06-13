import { Chip } from '@mui/material';
import { STATUS_COLORS } from '@/features/bills/constants';
import type { BillStatus } from '@/features/bills/types/bill';

interface StatusChipProps {
  status: BillStatus;
}

export function StatusChip({ status }: StatusChipProps): React.ReactElement {
  return <Chip label={status} size="small" color={STATUS_COLORS[status]} />;
}
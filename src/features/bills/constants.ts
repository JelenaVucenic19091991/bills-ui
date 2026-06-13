import type { ChipProps } from '@mui/material';
import type { BillStatus } from '@/features/bills/types/bill';

export const STATUS_COLORS: Record<BillStatus, ChipProps['color']> = {
  Current: 'success',
  Withdrawn: 'default',
  Enacted: 'primary',
  Rejected: 'error',
  Defeated: 'error',
  Lapsed: 'warning',
  Unknown: 'default',
};
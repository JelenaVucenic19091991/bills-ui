import type { ChipProps } from '@mui/material';
import type { BillStatus } from '@/features/bills/types/bill';
import { STRINGS } from '@/shared/constants/strings';

export const ROWS_PER_PAGE_DEFAULT = 10;
export const ROWS_PER_PAGE_OPTIONS = [10, 25, 50] as const;

export const BILL_TABLE_COLUMNS = [
  { key: 'number', label: STRINGS.table.columns.billNumber, align: 'left' },
  { key: 'type', label: STRINGS.table.columns.billType, align: 'left' },
  { key: 'status', label: STRINGS.table.columns.billStatus, align: 'left' },
  { key: 'sponsor', label: STRINGS.table.columns.sponsor, align: 'left' },
  { key: 'favourite', label: STRINGS.table.columns.favourite, align: 'center' },
] as const;

export const STATUS_COLORS: Record<BillStatus, ChipProps['color']> = {
  Current: 'success',
  Withdrawn: 'default',
  Enacted: 'primary',
  Rejected: 'error',
  Defeated: 'error',
  Lapsed: 'warning',
  Unknown: 'default',
};

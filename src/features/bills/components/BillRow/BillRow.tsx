import { TableCell, TableRow } from '@mui/material';
import type { KeyboardEvent, ReactElement } from 'react';
import { STRINGS } from '@/shared/constants/strings';
import { FavouriteButton } from '@/shared/components/FavouriteButton';
import { StatusChip } from '@/features/bills/components/StatusChip';
import type { Bill } from '@/features/bills/types/bill';

interface BillRowProps {
  bill: Bill;
  isFavourite: boolean;
  onRowClick: (bill: Bill) => void;
  onFavouriteToggle: (uri: string) => void;
}

export function BillRow({
  bill,
  isFavourite,
  onRowClick,
  onFavouriteToggle,
}: BillRowProps): ReactElement {
  function handleKeyDown(event: KeyboardEvent<HTMLTableRowElement>): void {
    // Only activate when the row itself is focused — not a child control
    // (e.g. the favourite button), which handles its own interaction.
    if (event.target !== event.currentTarget) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onRowClick(bill);
    }
  }

  return (
    <TableRow
      hover
      onClick={() => onRowClick(bill)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-label={STRINGS.actions.viewDetails(bill.number)}
      sx={{ cursor: 'pointer' }}
    >
      <TableCell>{bill.number}</TableCell>
      <TableCell>{bill.billType}</TableCell>
      <TableCell>
        <StatusChip status={bill.status} />
      </TableCell>
      <TableCell>{bill.sponsor}</TableCell>
      <TableCell align="center">
        <FavouriteButton
          isFavourite={isFavourite}
          onToggle={() => onFavouriteToggle(bill.uri)}
          ariaLabel={
            isFavourite
              ? STRINGS.actions.removeFromFavourites(bill.number)
              : STRINGS.actions.addToFavourites(bill.number)
          }
        />
      </TableCell>
    </TableRow>
  );
}

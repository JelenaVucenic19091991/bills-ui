import { TableCell, TableRow } from '@mui/material';
import { BillNumberLink } from '@/features/bills/components/BillNumberLink';
import { FavouriteButton } from '@/shared/components/FavouriteButton';
import type { Bill } from '@/features/bills/types/bill';
import { StatusChip } from '@/features/bills/components/StatusChip';

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
}: BillRowProps): React.ReactElement {
  return (
    <TableRow hover onClick={() => onRowClick(bill)} sx={{ cursor: 'pointer' }}>
      <TableCell>
        <BillNumberLink number={bill.number} onClick={() => onRowClick(bill)} />
      </TableCell>
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
              ? `Remove ${bill.number} from favourites`
              : `Add ${bill.number} to favourites`
          }
        />
      </TableCell>
    </TableRow>
  );
}
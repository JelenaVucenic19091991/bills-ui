import { Link } from '@mui/material';
import type { MouseEvent } from 'react';

interface BillNumberLinkProps {
  number: string;
  onClick: () => void;
}

export function BillNumberLink({ number, onClick }: BillNumberLinkProps): React.ReactElement {
  function handleClick(event: MouseEvent<HTMLButtonElement>): void {
    event.stopPropagation();
    onClick();
  }

  return (
    <Link
      component="button"
      underline="hover"
      onClick={handleClick}
      aria-label={`View details for bill ${number}`}
      sx={{ font: 'inherit', color: 'inherit' }}
    >
      {number}
    </Link>
  );
}
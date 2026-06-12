import { IconButton } from '@mui/material';
import { Star, StarBorder } from '@mui/icons-material';
import type { MouseEvent } from 'react';

interface FavouriteButtonProps {
  isFavourite: boolean;
  onToggle: () => void;
  ariaLabel: string;
}

export function FavouriteButton({
  isFavourite,
  onToggle,
  ariaLabel,
}: FavouriteButtonProps): React.ReactElement {
  function handleClick(event: MouseEvent<HTMLButtonElement>): void {
    event.stopPropagation();
    onToggle();
  }

  return (
    <IconButton aria-label={ariaLabel} onClick={handleClick} size="small">
      {isFavourite ? <Star color="warning" /> : <StarBorder />}
    </IconButton>
  );
}
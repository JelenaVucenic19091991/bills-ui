import { useCallback, useMemo } from 'react';
import { useLocalStorage } from '@/shared/hooks/useLocalStorage';
import type { Bill } from '@/features/bills/types/bill';

export const STORAGE_KEY = 'bills-ui.favourites';

interface UseFavouritesResult {
  favourites: Bill[];
  favouriteUris: string[];
  toggleFavourite: (bill: Bill) => void;
}

export function useFavourites(): UseFavouritesResult {
  const [favourites, setFavourites] = useLocalStorage<Bill[]>(STORAGE_KEY, []);

  const toggleFavourite = useCallback(
    (bill: Bill) => {
      setFavourites((prev) => {
        const exists = prev.some((b) => b.uri === bill.uri);
        // Mock server request, required by the assessment spec (no real endpoint).
        console.log(
          `Favourite request dispatched: bill ${bill.uri} → ${exists ? 'removed' : 'added'}`
        );
        return exists ? prev.filter((b) => b.uri !== bill.uri) : [...prev, bill];
      });
    },
    [setFavourites]
  );

  const favouriteUris = useMemo(() => favourites.map((b) => b.uri), [favourites]);

  return { favourites, favouriteUris, toggleFavourite };
}
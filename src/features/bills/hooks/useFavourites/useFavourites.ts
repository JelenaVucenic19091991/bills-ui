import { useCallback, useEffect, useState } from 'react';
import type { Bill } from '@/features/bills/types/bill';

const STORAGE_KEY = 'bills-ui.favourites';

function loadFavourites(): Bill[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as Bill[]) : [];
  } catch {
    return [];
  }
}

interface UseFavouritesResult {
  favourites: Bill[];
  favouriteUris: string[];
  toggleFavourite: (bill: Bill) => void;
  isFavourite: (uri: string) => boolean;
}

export function useFavourites(): UseFavouritesResult {
  const [favourites, setFavourites] = useState<Bill[]>(loadFavourites);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favourites));
    } catch {
      // Ignore write errors (e.g. storage quota exceeded)
    }
  }, [favourites]);

  const toggleFavourite = useCallback((bill: Bill) => {
    setFavourites((prev) => {
      const exists = prev.some((b) => b.uri === bill.uri);
      console.log(
        `Favourite request dispatched: bill ${bill.uri} → ${exists ? 'removed' : 'added'}`
      );
      return exists ? prev.filter((b) => b.uri !== bill.uri) : [...prev, bill];
    });
  }, []);

  const isFavourite = useCallback(
    (uri: string) => favourites.some((b) => b.uri === uri),
    [favourites]
  );

  const favouriteUris = favourites.map((b) => b.uri);

  return { favourites, favouriteUris, toggleFavourite, isFavourite };
}

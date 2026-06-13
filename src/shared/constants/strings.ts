/**
 * Centralized UI strings. Keeping all copy in one place keeps components free of
 * hardcoded text and makes the app i18n-ready: adding a language means swapping
 * this object (or wiring a library like react-i18next) without touching components.
 * Dynamic strings are functions, mirroring how i18n interpolation works.
 */
export const STRINGS = {
  app: {
    title: 'Bills Information',
    subtitle: 'Browse and manage bill information',
  },
  tabs: {
    allBills: 'All Bills',
    favouriteBills: 'Favourite Bills',
    ariaLabel: 'Bill list views',
  },
  table: {
    columns: {
      billNumber: 'Bill Number',
      billType: 'Bill Type',
      billStatus: 'Bill Status',
      sponsor: 'Sponsor',
      favourite: 'Favourite',
    },
    ariaLabel: 'Bills table',
    emptyAllBills: 'No bills match the selected filter.',
    emptyFavourites: 'No favourite bills yet. Click the star icon to add bills to your favourites.',
  },
  filter: {
    label: 'Filter by Bill Type',
    allTypes: 'All Types',
    tooltip:
      'Filtering loads the full dataset once and applies across all bills, not just the current page.',
    infoAriaLabel: 'Filter information',
  },
  modal: {
    title: (number: string) => `Bill ${number}`,
    tabEnglish: 'English',
    tabGaeilge: 'Gaeilge',
    close: 'Close',
  },
  actions: {
    viewDetails: (number: string) => `View details for bill ${number}`,
    addToFavourites: (number: string) => `Add ${number} to favourites`,
    removeFromFavourites: (number: string) => `Remove ${number} from favourites`,
    retry: 'Retry',
  },
  error: {
    boundary: 'Something went wrong. Please try again.',
    tryAgain: 'Try again',
  },
  status: {
    loading: 'Loading bills…',
    error: 'Failed to load bills.',
    loaded: (count: number) => `${count} bills loaded.`,
    loadingAll: 'Loading all bills to filter across the full dataset…',
  },
} as const;

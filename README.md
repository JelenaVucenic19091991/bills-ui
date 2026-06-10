# Bills Information UI

A React application for browsing and managing Irish legislative bills
from the Houses of the Oireachtas.

## Tech stack

- **React 19** + **TypeScript**
- **Vite** - build tool and dev server
- **Material UI v6** - component library
- **Vitest** + **React Testing Library** - unit testing
- **ESLint** + **Prettier** - code consistency

## Prerequisites

- Node.js v20+
- npm v9+

## Setup

```bash
cp .env.example .env
npm install
```

## Run in development mode

```bash
npm run dev
```

Opens at `http://localhost:5173`.

## Run tests

```bash
npm run test
```

## Lint and format

```bash
npm run lint
npm run format
```

## Project structure

```
src/
├── components/        # UI components (BillsTable, BillDetailsModal, BillTypeFilter, PageLayout, ErrorBoundary)
├── hooks/             # Custom hooks (useBills)
├── pages/             # Page components (BillsPage)
├── services/          # API layer and data mapping (billsApi)
├── types/             # TypeScript interfaces (Bill, ApiResponse)
└── utils/             # Pure utility functions (billFilters)
```

## Architecture decisions

- **Mapper pattern** - raw API responses are mapped to a domain `Bill` type
  in the service layer; components never depend on the API shape directly
- **Custom hook** - `useBills` isolates data-fetching logic from the page component
- **Server-side pagination** - bills are fetched page by page via API `skip`/`limit`
  parameters, ensuring accurate totals across the full dataset (~6000 bills)
- **Client-side Bill type filter** - filters the current page of results by `billType`.
  Known values from the API are `"Public"`, `"Private"`, and `"Hybrid"` (verified
  across the full dataset). A tooltip informs the user that the filter applies to
  the current page only
- **Favourite bills** are stored as full `Bill` objects in local state, allowing
  favourites to persist across page navigation
- **Favourite server requests** are mocked via `console.log` as per the spec
- **MUI v6** is used rather than v9 due to a known Vitest ESM incompatibility on Windows
- **Error boundary** wraps the application root to prevent full-page crashes

## Notes

- `shortTitleEn` / `shortTitleGa` are used in the bill modal; `longTitle` fields
  contain raw HTML and would require sanitization (e.g. DOMPurify) which is out of scope
- **Bill number** is displayed as `year/billNo` (e.g. `2026/53`), constructed
  from the API's separate `billYear` and `billNo` fields. This ensures uniqueness
  across years as `billNo` alone resets each year
- **`source` field** ("Government" / "Private Member") is mapped from the API
  but intentionally not rendered - the task specifies Bill number, Bill type,
  Bill status, and Sponsor as the required columns
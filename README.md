# Bills Information UI

A React application for browsing and managing Irish legislative bills
from the Houses of the Oireachtas.

## Tech stack

- **React 19** + **TypeScript**
- **Vite** - build tool and dev server
- **Material UI v6** - component library
- **TanStack Query (React Query)** - server state, caching, pagination
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
├── hooks/             # Custom hooks (useBills, useFavourites, usePagination, useBillModal)
├── pages/             # Page components (BillsPage)
├── services/          # API layer and data mapping (billsApi)
├── types/             # TypeScript types and domain constants (Bill, ApiResponse, BillType, BillStatus)
└── utils/             # Pure utility functions (billFilters)
```

## Architecture decisions

- **Mapper pattern** - raw API responses are mapped to a domain `Bill` type
  in the service layer; components never depend on the API shape directly
- **React Query** - `useBills` wraps `useQuery` with `placeholderData: keepPreviousData`
  so the current page stays visible while the next loads, plus `staleTime`/`gcTime`
  caching and `AbortSignal` cancellation. The query is disabled on the Favourites tab
  via `enabled`, avoiding unnecessary requests
- **Custom hooks** - logic is split into focused hooks: `useBills` (data fetching),
  `useFavourites` (favourites + persistence), `usePagination` (page state),
  `useBillModal` (modal state). `BillsPage` is a thin orchestrator
- **Server-side pagination** - bills are fetched page by page via API `skip`/`limit`
  parameters, ensuring accurate totals across the full dataset (~6000 bills)
- **Favourites** are stored as full `Bill` objects and persisted to `localStorage`,
  so they survive page refreshes and remain available across pages. Favourites are
  paginated client-side, with page clamping when the list shrinks
- **Client-side Bill type filter** - filters the current page of results by `billType`.
  Known values from the API are `"Public"`, `"Private"`, and `"Hybrid"` (verified
  across the full dataset). A tooltip notes that the filter applies to the current page
- **Favourite server requests** are mocked via `console.log` as per the spec
- **Strong typing** - `BillType` and `BillStatus` are union types rather than raw
  strings, keeping the domain model type-safe
- **MUI v6** is used rather than v9 due to a known Vitest ESM incompatibility on Windows
- **Error boundary** wraps the application root to prevent full-page crashes; the
  data layer surfaces errors with a retry action

## Notes

- `shortTitleEn` / `shortTitleGa` are used in the bill modal; `longTitle` fields
  contain raw HTML and would require sanitization (e.g. DOMPurify) which is out of scope
- **Bill number** is displayed as `year/billNo` (e.g. `2026/53`), constructed
  from the API's separate `billYear` and `billNo` fields. This ensures uniqueness
  across years as `billNo` alone resets each year
- **`source` field** ("Government" / "Private Member") is present in the raw API
  response but intentionally not mapped into the domain model - the task specifies
  Bill number, Bill type, Bill status, and Sponsor as the required columns
- **Runtime validation** - the mapper trusts the documented API contract when narrowing
  `billType`/`status` to union types; a production app would add schema validation (e.g. Zod)
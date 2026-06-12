import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactElement } from 'react';
import * as billsApi from '@/features/bills/api/billsApi';
import { BillsPage } from './BillsPage';
import type { Bill } from '@/features/bills/types/bill';

vi.mock('@/features/bills/api/billsApi');

const mockBills: Bill[] = [
  {
    uri: '/ie/oireachtas/bill/2026/53',
    number: '2026/53',
    billType: 'Public',
    status: 'Current',
    sponsor: 'Minister for Finance',
    titleEn: 'Finance Bill 2026',
    titleGa: 'An Bille Airgeadais, 2026',
  },
  {
    uri: '/ie/oireachtas/bill/2026/52',
    number: '2026/52',
    billType: 'Private',
    status: 'Withdrawn',
    sponsor: 'Paul Murphy',
    titleEn: 'Some Private Bill 2026',
    titleGa: 'An Bille Príobháideach, 2026',
  },
];

function renderPage(): ReactElement {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  return (
    <QueryClientProvider client={queryClient}>
      <BillsPage />
    </QueryClientProvider>
  );
}

beforeEach(() => {
  localStorage.clear();
  vi.mocked(billsApi.fetchBills).mockResolvedValue({ bills: mockBills, total: 2 });
});

afterEach(() => {
  vi.restoreAllMocks();
  localStorage.clear();
});

describe('BillsPage', () => {
  it('shows skeleton while loading', () => {
    render(renderPage());
    expect(document.querySelector('.MuiSkeleton-root')).toBeInTheDocument();
  });

  it('renders bills after loading', async () => {
    render(renderPage());
    await waitFor(() => expect(screen.getByText('2026/53')).toBeInTheDocument());
    expect(screen.getByText('2026/52')).toBeInTheDocument();
  });

  it('shows error message with retry when fetch fails', async () => {
    vi.mocked(billsApi.fetchBills).mockRejectedValue(new Error('Network error'));
    render(renderPage());
    await waitFor(() => expect(screen.getByText('Network error')).toBeInTheDocument());
    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
  });

  it('opens modal when bill row is clicked', async () => {
    render(renderPage());
    await waitFor(() => expect(screen.getByText('2026/53')).toBeInTheDocument());

    await userEvent.click(screen.getByText('2026/53'));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Bill 2026/53')).toBeInTheDocument();
  });

  it('adds bill to favourites tab when starred', async () => {
    render(renderPage());
    await waitFor(() => expect(screen.getByText('2026/53')).toBeInTheDocument());

    await userEvent.click(screen.getByRole('button', { name: 'Add 2026/53 to favourites' }));
    await userEvent.click(screen.getByRole('tab', { name: 'Favourite Bills' }));

    expect(screen.getByText('2026/53')).toBeInTheDocument();
    expect(screen.queryByText('2026/52')).not.toBeInTheDocument();
  });

  it('logs console message when bill is favourited', async () => {
    const consoleSpy = vi.spyOn(console, 'log');
    try {
      render(renderPage());
      await waitFor(() => expect(screen.getByText('2026/53')).toBeInTheDocument());

      await userEvent.click(screen.getByRole('button', { name: 'Add 2026/53 to favourites' }));

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Favourite request dispatched')
      );
    } finally {
      consoleSpy.mockRestore();
    }
  });

  it('hides filter on Favourite Bills tab', async () => {
    render(renderPage());
    await waitFor(() => expect(screen.getByText('2026/53')).toBeInTheDocument());

    expect(screen.getByLabelText('Filter by Bill Type')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('tab', { name: 'Favourite Bills' }));

    expect(screen.queryByLabelText('Filter by Bill Type')).not.toBeInTheDocument();
  });

  it('persists favourites to localStorage', async () => {
    render(renderPage());
    await waitFor(() => expect(screen.getByText('2026/53')).toBeInTheDocument());

    await userEvent.click(screen.getByRole('button', { name: 'Add 2026/53 to favourites' }));

    const stored = localStorage.getItem('bills-ui.favourites');
    expect(stored).toContain('/ie/oireachtas/bill/2026/53');
  });

  it('restores favourites from localStorage on mount', async () => {
    localStorage.setItem('bills-ui.favourites', JSON.stringify([mockBills[0]]));

    render(renderPage());
    await waitFor(() => expect(screen.getByText('2026/53')).toBeInTheDocument());

    await userEvent.click(screen.getByRole('tab', { name: 'Favourite Bills' }));

    expect(screen.getByText('2026/53')).toBeInTheDocument();
  });

  it('clamps to a valid page when favourites shrink below the current page', async () => {
    const threeFavourites = [
      mockBills[0]!,
      mockBills[1]!,
      {
        uri: '/ie/oireachtas/bill/2026/51',
        number: '2026/51',
        billType: 'Public' as const,
        status: 'Current' as const,
        sponsor: 'Minister for Health',
        titleEn: 'Health Bill 2026',
        titleGa: 'An Bille Sláinte, 2026',
      },
    ];
    localStorage.setItem('bills-ui.favourites', JSON.stringify(threeFavourites));

    render(renderPage());
    await waitFor(() => expect(screen.getByText('2026/53')).toBeInTheDocument());

    await userEvent.click(screen.getByRole('tab', { name: 'Favourite Bills' }));

    await userEvent.click(screen.getByRole('button', { name: 'Remove 2026/53 from favourites' }));
    await userEvent.click(screen.getByRole('button', { name: 'Remove 2026/52 from favourites' }));
    await userEvent.click(screen.getByRole('button', { name: 'Remove 2026/51 from favourites' }));

    expect(
      screen.getByText(
        'No favourite bills yet. Click the star icon to add bills to your favourites.'
      )
    ).toBeInTheDocument();
  });
});

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as billsApi from '../services/billsApi';
import { BillsPage } from './BillsPage';
import type { Bill } from '../types/bill';

vi.mock('../services/billsApi');

const mockBills: Bill[] = [
  {
    uri: '/ie/oireachtas/bill/2026/53',
    number: '2026/53',
    billType: 'Public',
    source: 'Government',
    status: 'Current',
    sponsor: 'Minister for Finance',
    titleEn: 'Finance Bill 2026',
    titleGa: 'An Bille Airgeadais, 2026',
  },
  {
    uri: '/ie/oireachtas/bill/2026/52',
    number: '2026/52',
    billType: 'Private',
    source: 'Private Member',
    status: 'Withdrawn',
    sponsor: 'Paul Murphy',
    titleEn: 'Some Private Bill 2026',
    titleGa: 'An Bille Príobháideach, 2026',
  },
];

beforeEach(() => {
  vi.mocked(billsApi.fetchBills).mockResolvedValue({
    bills: mockBills,
    total: 2,
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('BillsPage', () => {
  it('shows skeleton while loading', async () => {
    render(<BillsPage />);
    expect(document.querySelector('.MuiSkeleton-root')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText('2026/53')).toBeInTheDocument();
    });
  });

  it('renders bills after loading', async () => {
    render(<BillsPage />);
    await waitFor(() => {
      expect(screen.getByText('2026/53')).toBeInTheDocument();
    });
    expect(screen.getByText('2026/52')).toBeInTheDocument();
  });

  it('shows error message when fetch fails', async () => {
    vi.mocked(billsApi.fetchBills).mockRejectedValue(new Error('Network error'));
    render(<BillsPage />);
    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });
  });

  it('opens modal when bill row is clicked', async () => {
    render(<BillsPage />);
    await waitFor(() => {
      expect(screen.getByText('2026/53')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByText('2026/53'));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Bill 2026/53')).toBeInTheDocument();
  });

  it('adds bill to favourites tab when starred', async () => {
    render(<BillsPage />);
    await waitFor(() => {
      expect(screen.getByText('2026/53')).toBeInTheDocument();
    });

    const buttons = screen.getAllByRole('button', { name: 'Add to favourites' });
    await userEvent.click(buttons[0]!);

    await userEvent.click(screen.getByRole('tab', { name: 'Favourite Bills' }));

    expect(screen.getByText('2026/53')).toBeInTheDocument();
    expect(screen.queryByText('2026/52')).not.toBeInTheDocument();
  });

  it('logs console message when bill is favourited', async () => {
    const consoleSpy = vi.spyOn(console, 'log');

    try {
      render(<BillsPage />);

      await waitFor(() => {
        expect(screen.getByText('2026/53')).toBeInTheDocument();
      });

      const buttons = screen.getAllByRole('button', { name: 'Add to favourites' });
      await userEvent.click(buttons[0]!);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Favourite request dispatched')
      );
    } finally {
      consoleSpy.mockRestore();
    }
  });

  it('hides filter on Favourite Bills tab', async () => {
    render(<BillsPage />);
    await waitFor(() => {
      expect(screen.getByText('2026/53')).toBeInTheDocument();
    });

    expect(screen.getByLabelText('Filter by Bill Type')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('tab', { name: 'Favourite Bills' }));

    expect(screen.queryByLabelText('Filter by Bill Type')).not.toBeInTheDocument();
  });
});

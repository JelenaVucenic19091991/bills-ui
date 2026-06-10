import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { BillsTable, BillsTableSkeleton } from './BillsTable';
import type { Bill } from '../../types/bill';

const mockBills: Bill[] = [
  {
    uri: '/ie/oireachtas/bill/2026/53',
    number: '2026/53',
    billType: 'Public',
    source: 'Government',
    status: 'First Stage',
    sponsor: 'Minister for Finance',
    titleEn: 'Finance Bill 2026',
    titleGa: 'An Bille Airgeadais, 2026',
  },
  {
    uri: '/ie/oireachtas/bill/2026/52',
    number: '2026/52',
    billType: 'Private',
    source: 'Private Member',
    status: 'Second Stage',
    sponsor: 'Paul Murphy',
    titleEn: 'Some Private Bill 2026',
    titleGa: 'An Bille Príobháideach, 2026',
  },
];

const defaultProps = {
  bills: mockBills,
  favouriteUris: [],
  totalCount: mockBills.length,
  page: 0,
  rowsPerPage: 10,
  onPageChange: vi.fn(),
  onRowsPerPageChange: vi.fn(),
  onRowClick: vi.fn(),
  onFavouriteToggle: vi.fn(),
};

describe('BillsTable', () => {
  it('renders bill rows from props', () => {
    render(<BillsTable {...defaultProps} />);
    expect(screen.getByText('2026/53')).toBeInTheDocument();
    expect(screen.getByText('Minister for Finance')).toBeInTheDocument();
    expect(screen.getByText('2026/52')).toBeInTheDocument();
    expect(screen.getByText('Paul Murphy')).toBeInTheDocument();
  });

  it('calls onFavouriteToggle with correct uri on star click', async () => {
    const onFavouriteToggle = vi.fn();
    render(<BillsTable {...defaultProps} onFavouriteToggle={onFavouriteToggle} />);

    const buttons = screen.getAllByRole('button', { name: 'Add to favourites' });
    const firstButton = buttons[0];
    expect(firstButton).toBeDefined();
    await userEvent.click(firstButton!);

    expect(onFavouriteToggle).toHaveBeenCalledWith('/ie/oireachtas/bill/2026/53');
  });

  it('calls onRowClick with correct bill on row click', async () => {
    const onRowClick = vi.fn();
    render(<BillsTable {...defaultProps} onRowClick={onRowClick} />);

    await userEvent.click(screen.getByText('2026/53'));

    expect(onRowClick).toHaveBeenCalledWith(mockBills[0]);
  });

  it('shows empty message when bills array is empty', () => {
    render(<BillsTable {...defaultProps} bills={[]} totalCount={0} />);
    expect(screen.getByText('No bills match the selected filter.')).toBeInTheDocument();
  });

  it('shows Remove from favourites aria-label for favourited bill', () => {
    render(<BillsTable {...defaultProps} favouriteUris={['/ie/oireachtas/bill/2026/53']} />);
    expect(screen.getByRole('button', { name: 'Remove from favourites' })).toBeInTheDocument();
  });

  it('shows Add to favourites aria-label for non-favourited bills', () => {
    render(<BillsTable {...defaultProps} favouriteUris={[]} />);
    const buttons = screen.getAllByRole('button', { name: 'Add to favourites' });
    expect(buttons).toHaveLength(2);
  });

  it('renders skeleton rows', () => {
    const { container } = render(<BillsTableSkeleton />);
    expect(container.querySelectorAll('.MuiSkeleton-root')).toHaveLength(10);
  });

  it('calls onRowClick when Enter is pressed on a row', async () => {
    const onRowClick = vi.fn();
    render(<BillsTable {...defaultProps} onRowClick={onRowClick} />);

    const row = screen.getAllByRole('button')[0]!.closest('tr');
    expect(row).toBeDefined();
    await userEvent.type(row!, '{Enter}');

    expect(onRowClick).toHaveBeenCalled();
  });
});

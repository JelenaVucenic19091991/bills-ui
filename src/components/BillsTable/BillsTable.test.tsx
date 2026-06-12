import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { BillsTable } from './BillsTable';
import type { Bill } from '@/types/bill';

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

    await userEvent.click(screen.getByRole('button', { name: 'Add 2026/53 to favourites' }));

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

  it('shows custom empty message when provided', () => {
    render(
      <BillsTable
        {...defaultProps}
        bills={[]}
        totalCount={0}
        emptyMessage="No favourite bills yet."
      />
    );
    expect(screen.getByText('No favourite bills yet.')).toBeInTheDocument();
  });

  it('shows Remove aria-label for favourited bill', () => {
    render(<BillsTable {...defaultProps} favouriteUris={['/ie/oireachtas/bill/2026/53']} />);
    expect(
      screen.getByRole('button', { name: 'Remove 2026/53 from favourites' })
    ).toBeInTheDocument();
  });

  it('shows Add aria-label for non-favourited bills', () => {
    render(<BillsTable {...defaultProps} favouriteUris={[]} />);
    expect(screen.getByRole('button', { name: 'Add 2026/53 to favourites' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add 2026/52 to favourites' })).toBeInTheDocument();
  });

  it('opens bill via the Bill Number link (keyboard accessible)', async () => {
    const onRowClick = vi.fn();
    render(<BillsTable {...defaultProps} onRowClick={onRowClick} />);

    await userEvent.click(screen.getByRole('button', { name: 'View details for bill 2026/53' }));

    expect(onRowClick).toHaveBeenCalledWith(mockBills[0]);
  });

  it('calls onPageChange when next page button is clicked', async () => {
    const onPageChange = vi.fn();
    render(<BillsTable {...defaultProps} totalCount={50} onPageChange={onPageChange} />);

    await userEvent.click(screen.getByRole('button', { name: 'Go to next page' }));

    expect(onPageChange).toHaveBeenCalledWith(1);
  });
});

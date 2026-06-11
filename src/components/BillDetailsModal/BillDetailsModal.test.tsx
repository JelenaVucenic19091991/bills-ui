import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { BillDetailsModal } from './BillDetailsModal';
import type { Bill } from '../../types/bill';

const mockBill: Bill = {
  uri: '/ie/oireachtas/bill/2026/53',
  number: '2026/53',
  billType: 'Public',
  status: 'Current',
  sponsor: 'Minister for Finance',
  titleEn: 'Finance Bill 2026',
  titleGa: 'An Bille Airgeadais, 2026',
};

const defaultProps = {
  bill: mockBill,
  open: true,
  onClose: vi.fn(),
};

describe('BillDetailsModal', () => {
  it('renders bill number in title', () => {
    render(<BillDetailsModal {...defaultProps} />);
    expect(screen.getByText('Bill 2026/53')).toBeInTheDocument();
  });

  it('renders English title by default', () => {
    render(<BillDetailsModal {...defaultProps} />);
    expect(screen.getByText('Finance Bill 2026')).toBeInTheDocument();
  });

  it('calls onClose when Close button is clicked', async () => {
    const onClose = vi.fn();
    render(<BillDetailsModal {...defaultProps} onClose={onClose} />);
    await userEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalled();
  });

  it('does not render when open is false', () => {
    render(<BillDetailsModal {...defaultProps} open={false} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('shows Gaeilge title when Gaeilge tab is clicked', async () => {
    render(<BillDetailsModal {...defaultProps} />);
    await userEvent.click(screen.getByRole('tab', { name: 'Gaeilge' }));
    expect(screen.getByText('An Bille Airgeadais, 2026')).toBeInTheDocument();
  });

  it('resets to English tab when reopened after viewing Gaeilge', async () => {
    const { rerender } = render(<BillDetailsModal {...defaultProps} />);

    await userEvent.click(screen.getByRole('tab', { name: 'Gaeilge' }));
    expect(screen.getByText('An Bille Airgeadais, 2026')).toBeInTheDocument();

    rerender(<BillDetailsModal key="closed" bill={mockBill} open={false} onClose={vi.fn()} />);

    rerender(<BillDetailsModal key="open" bill={mockBill} open={true} onClose={vi.fn()} />);

    expect(screen.getByText('Finance Bill 2026')).toBeInTheDocument();
  });
});

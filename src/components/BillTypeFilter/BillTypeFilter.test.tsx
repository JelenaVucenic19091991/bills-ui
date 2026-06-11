import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { BillTypeFilter } from './BillTypeFilter';
import { ALL_FILTER } from '../../types/bill';
import type { BillTypeFilterValue } from '../../types/bill';

const defaultProps = {
  selectedBillType: ALL_FILTER as BillTypeFilterValue,
  onChange: vi.fn(),
};

describe('BillTypeFilter', () => {
  it('renders All Types option', () => {
    render(<BillTypeFilter {...defaultProps} />);
    expect(screen.getByText('All Types')).toBeInTheDocument();
  });

  it('renders all bill type options when opened', async () => {
    render(<BillTypeFilter {...defaultProps} />);

    await userEvent.click(screen.getByRole('combobox'));

    expect(screen.getByRole('option', { name: 'Public' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Private' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Hybrid' })).toBeInTheDocument();
  });

  it('calls onChange with correct value on selection', async () => {
    const onChange = vi.fn();
    render(<BillTypeFilter {...defaultProps} onChange={onChange} />);

    await userEvent.click(screen.getByRole('combobox'));
    await userEvent.click(screen.getByRole('option', { name: 'Public' }));

    expect(onChange).toHaveBeenCalledWith('Public');
  });

  it('renders info tooltip icon', () => {
    render(<BillTypeFilter {...defaultProps} />);
    expect(screen.getByRole('button', { name: 'Filter information' })).toBeInTheDocument();
  });
});

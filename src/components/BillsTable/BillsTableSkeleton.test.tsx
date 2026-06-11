import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BillsTableSkeleton } from './BillsTableSkeleton';

describe('BillsTableSkeleton', () => {
  it('renders the default number of skeleton rows', () => {
    const { container } = render(<BillsTableSkeleton />);
    expect(container.querySelectorAll('.MuiSkeleton-root')).toHaveLength(10);
  });

  it('renders skeleton rows matching the rowsPerPage prop', () => {
    const { container } = render(<BillsTableSkeleton rowsPerPage={25} />);
    expect(container.querySelectorAll('.MuiSkeleton-root')).toHaveLength(25);
  });

  it('renders a single skeleton row when rowsPerPage is 1', () => {
    const { container } = render(<BillsTableSkeleton rowsPerPage={1} />);
    expect(container.querySelectorAll('.MuiSkeleton-root')).toHaveLength(1);
  });
});
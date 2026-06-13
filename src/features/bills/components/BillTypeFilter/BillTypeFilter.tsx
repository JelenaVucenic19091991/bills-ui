import type { ReactElement } from 'react';
import { Box, FormControl, InputLabel, MenuItem, Select, Tooltip, IconButton } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import type { SelectChangeEvent } from '@mui/material';
import { STRINGS } from '@/shared/constants/strings';
import { BILL_TYPES, ALL_FILTER } from '@/features/bills/types/bill';
import type { BillTypeFilterValue } from '@/features/bills/types/bill';

interface BillTypeFilterProps {
  selectedBillType: BillTypeFilterValue;
  onChange: (billType: BillTypeFilterValue) => void;
}

export function BillTypeFilter({
  selectedBillType,
  onChange,
}: BillTypeFilterProps): ReactElement {
  function handleChange(event: SelectChangeEvent): void {
    onChange(event.target.value as BillTypeFilterValue);
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <FormControl size="small" sx={{ minWidth: 200 }}>
        <InputLabel id="bill-type-filter-label">{STRINGS.filter.label}</InputLabel>
        <Select
          labelId="bill-type-filter-label"
          id="bill-type-filter"
          value={selectedBillType}
          label={STRINGS.filter.label}
          onChange={handleChange}
        >
          <MenuItem value={ALL_FILTER}>{STRINGS.filter.allTypes}</MenuItem>
          {BILL_TYPES.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Tooltip title={STRINGS.filter.tooltip}>
        <IconButton size="small" aria-label={STRINGS.filter.infoAriaLabel}>
          <InfoOutlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
}

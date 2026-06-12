import { Box, FormControl, InputLabel, MenuItem, Select, Tooltip, IconButton } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import type { SelectChangeEvent } from '@mui/material';
import { BILL_TYPES, ALL_FILTER } from '@/types/bill';
import type { BillTypeFilterValue } from '@/types/bill';

interface BillTypeFilterProps {
  selectedBillType: BillTypeFilterValue;
  onChange: (billType: BillTypeFilterValue) => void;
}

export function BillTypeFilter({
  selectedBillType,
  onChange,
}: BillTypeFilterProps): React.ReactElement {
  function handleChange(event: SelectChangeEvent): void {
    onChange(event.target.value as BillTypeFilterValue);
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <FormControl size="small" sx={{ minWidth: 200 }}>
        <InputLabel id="bill-type-filter-label">Filter by Bill Type</InputLabel>
        <Select
          labelId="bill-type-filter-label"
          id="bill-type-filter"
          value={selectedBillType}
          label="Filter by Bill Type"
          onChange={handleChange}
        >
          <MenuItem value={ALL_FILTER}>All Types</MenuItem>
          {BILL_TYPES.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Tooltip title="Filter applies to the current page only. If the selected type is not present on this page, the table will be empty.">
        <IconButton size="small" aria-label="Filter information">
          <InfoOutlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
}

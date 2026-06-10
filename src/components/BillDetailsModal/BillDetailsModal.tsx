import { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import type { Bill } from '../../types/bill';

interface BillDetailsModalProps {
  bill: Bill;
  open: boolean;
  onClose: () => void;
}

export function BillDetailsModal({
  bill,
  open,
  onClose,
}: BillDetailsModalProps): React.ReactElement {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="bill-modal-title"
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle id="bill-modal-title">Bill {bill.number}</DialogTitle>

      <DialogContent>
        <Tabs
          value={activeTab}
          onChange={(_, value: number) => setActiveTab(value)}
          sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="English" />
          <Tab label="Gaeilge" />
        </Tabs>

        <Box>
          {activeTab === 0 && <Typography variant="body1">{bill.titleEn}</Typography>}
          {activeTab === 1 && <Typography variant="body1">{bill.titleGa}</Typography>}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

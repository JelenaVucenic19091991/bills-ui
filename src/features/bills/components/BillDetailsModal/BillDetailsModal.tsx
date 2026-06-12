import { useEffect, useState } from 'react';
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
import type { Bill } from '@/features/bills/types/bill';
import { STRINGS } from '@/shared/constants/strings';

interface BillDetailsModalProps {
  bill: Bill | null;
  open: boolean;
  onClose: () => void;
}

export function BillDetailsModal({
  bill,
  open,
  onClose,
}: BillDetailsModalProps): React.ReactElement {
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (bill) setActiveTab(0);
  }, [bill]);

  const titleTabs = bill
    ? [
        { label: STRINGS.modal.tabEnglish, content: bill.titleEn },
        { label: STRINGS.modal.tabGaeilge, content: bill.titleGa },
      ]
    : [];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="bill-modal-title"
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle id="bill-modal-title">
        {bill ? STRINGS.modal.title(bill.number) : ''}
      </DialogTitle>

      <DialogContent>
        <Tabs
          value={activeTab}
          onChange={(_, value: number) => setActiveTab(value)}
          aria-label="Bill title language"
          sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
        >
          {titleTabs.map((tab, index) => (
            <Tab
              key={tab.label}
              label={tab.label}
              id={`bill-tab-${index}`}
              aria-controls={`bill-tabpanel-${index}`}
            />
          ))}
        </Tabs>

        {titleTabs.map((tab, index) => (
          <Box
            key={tab.label}
            role="tabpanel"
            hidden={activeTab !== index}
            id={`bill-tabpanel-${index}`}
            aria-labelledby={`bill-tab-${index}`}
          >
            {activeTab === index && <Typography variant="body1">{tab.content}</Typography>}
          </Box>
        ))}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>{STRINGS.modal.close}</Button>
      </DialogActions>
    </Dialog>
  );
}
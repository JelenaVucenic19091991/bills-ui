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
import type { Bill } from '@/features/bills/types/bill';
import { STRINGS } from '@/shared/constants/strings';

interface BillDetailsModalProps {
  bill: Bill | null;
  open: boolean;
  onClose: () => void;
  onExited?: () => void;
}

export function BillDetailsModal({
  bill,
  open,
  onClose,
  onExited,
}: BillDetailsModalProps): React.ReactElement {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="bill-modal-title"
      maxWidth="sm"
      fullWidth
      slotProps={{ transition: { onExited } }}
    >
      {bill && <BillDetailsContent key={bill.uri} bill={bill} onClose={onClose} />}
    </Dialog>
  );
}

interface BillDetailsContentProps {
  bill: Bill;
  onClose: () => void;
}

/**
 * Inner content keyed by bill.uri so tab state resets per bill via remount,
 * not via an effect. Kept mounted by the parent Dialog during the exit
 * transition, so content doesn't blank out mid-animation.
 */
function BillDetailsContent({ bill, onClose }: BillDetailsContentProps): React.ReactElement {
  const [activeTab, setActiveTab] = useState(0);

  const titleTabs = [
    { label: STRINGS.modal.tabEnglish, content: bill.titleEn },
    { label: STRINGS.modal.tabGaeilge, content: bill.titleGa },
  ];

  return (
    <>
      <DialogTitle id="bill-modal-title">{STRINGS.modal.title(bill.number)}</DialogTitle>

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
    </>
  );
}
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { PageLayout } from '@/components/PageLayout';
import { BillsPage } from '@/pages/BillsPage';

export default function App(): React.ReactElement {
  return (
    <ErrorBoundary>
      <PageLayout>
        <BillsPage />
      </PageLayout>
    </ErrorBoundary>
  );
}

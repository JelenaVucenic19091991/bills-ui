import { ErrorBoundary } from '@/shared/components/ErrorBoundary';
import { PageLayout } from '@/shared/components/PageLayout';
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

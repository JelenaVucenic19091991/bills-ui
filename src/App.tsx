import { ErrorBoundary } from '@/shared/components/ErrorBoundary';
import { PageLayout } from '@/shared/components/PageLayout';
import { BillsPage } from '@/pages/BillsPage';
import { STRINGS } from '@/shared/constants';

export default function App(): React.ReactElement {
  return (
    <ErrorBoundary>
      <PageLayout title={STRINGS.app.title} subtitle={STRINGS.app.subtitle}>
        <BillsPage />
      </PageLayout>
    </ErrorBoundary>
  );
}

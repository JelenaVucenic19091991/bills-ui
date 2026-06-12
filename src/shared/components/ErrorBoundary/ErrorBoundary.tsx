import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { Alert, Button, Container } from '@mui/material';
import { STRINGS } from '@/shared/constants/strings';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // In production this would report to an error-tracking service (e.g. Sentry).
    console.log('ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleReset = (): void => {
    this.setState({ hasError: false });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Alert
            severity="error"
            action={
              <Button color="inherit" size="small" onClick={this.handleReset}>
                {STRINGS.error.tryAgain}
              </Button>
            }
          >
            {STRINGS.error.boundary}
          </Alert>
        </Container>
      );
    }
    return this.props.children;
  }
}
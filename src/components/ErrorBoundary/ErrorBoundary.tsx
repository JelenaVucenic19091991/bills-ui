import { Component } from 'react';
import type { ReactNode } from 'react';
import { Alert, Container } from '@mui/material';

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

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Alert severity="error">Something went wrong. Please refresh the page.</Alert>
        </Container>
      );
    }
    return this.props.children;
  }
}

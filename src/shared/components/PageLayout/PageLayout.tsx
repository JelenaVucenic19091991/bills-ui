import type { ReactElement } from 'react';
import { Container, Box, Typography } from '@mui/material';

interface PageLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function PageLayout({ title, subtitle, children }: PageLayoutProps): ReactElement {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1">
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Box>
      {children}
    </Container>
  );
}

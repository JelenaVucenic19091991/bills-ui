import { Container, Box, Typography } from '@mui/material';

interface PageLayoutProps {
  children: React.ReactNode;
}

export function PageLayout({ children }: PageLayoutProps): React.ReactElement {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1">
          Bills Information
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Browse and manage bills information
        </Typography>
      </Box>
      {children}
    </Container>
  );
}

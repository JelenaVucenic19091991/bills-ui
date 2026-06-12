import { Container, Box, Typography } from '@mui/material';
import { STRINGS } from '@/shared/constants/strings';

interface PageLayoutProps {
  children: React.ReactNode;
}

export function PageLayout({ children }: PageLayoutProps): React.ReactElement {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1">
          {STRINGS.app.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {STRINGS.app.subtitle}
        </Typography>
      </Box>
      {children}
    </Container>
  );
}

import { Button, Container, Typography } from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import type { FallbackProps } from 'react-error-boundary';

/** Shown whenever something below throws. */
export default function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <Container sx={{ py: 8, textAlign: 'center' }}>
      <Typography variant="h3" gutterBottom color="error">
        Something went wrong
      </Typography>

      <Typography sx={{ mb: 4 }} color="text.secondary">
        {error.message}
      </Typography>

      <Button
        variant="contained"
        startIcon={<RestartAltIcon />}
        onClick={resetErrorBoundary}
      >
        Try again
      </Button>
    </Container>
  );
}

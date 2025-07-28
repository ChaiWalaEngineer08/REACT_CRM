// src/components/ChunkBoundary.tsx
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { CircularProgress, Button, Box, Typography } from '@mui/material';

/* ---------- loading ui (spinner) ------------------------------- */
function ChunkSpinner() {
  return (
    <Box className="w-screen h-screen flex items-center justify-center">
      <CircularProgress />
    </Box>
  );
}

/* ---------- error ui ------------------------------------------- */
function ChunkErrorFallback({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  return (
    <Box className="w-screen h-screen flex flex-col items-center justify-center gap-4">
      <Typography variant="h5" color="error">
        Something went wrong while loading this page.
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {error.message}
      </Typography>
      <Button variant="contained" onClick={resetErrorBoundary}>
        Retry
      </Button>
    </Box>
  );
}

/* ---------- Composition: ErrorBoundary ⊃ Suspense -------------- */
export default function ChunkBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary FallbackComponent={ChunkErrorFallback}>
      <Suspense fallback={<ChunkSpinner />}>{children}</Suspense>
    </ErrorBoundary>
  );
}

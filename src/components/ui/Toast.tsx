import { SnackbarProvider, useSnackbar } from 'notistack';
import type { ReactNode } from 'react';

export const ToastProvider = ({ children }: { children: ReactNode }) => (
  <SnackbarProvider
    maxSnack={3}
    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    autoHideDuration={2500}
  >
    {children}
  </SnackbarProvider>
);

export const useToast = () => {
  const { enqueueSnackbar } = useSnackbar();
  return enqueueSnackbar;          
};

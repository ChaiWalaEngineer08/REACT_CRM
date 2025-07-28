import React from 'react';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';
import ReactDOM from 'react-dom/client';
import AppRouter from './routes/Router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from '../src/components/ErrorFallback';

import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';

const qc = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <QueryClientProvider client={qc}>
        <QueryErrorResetBoundary>
          {({ reset }) => (
            <ErrorBoundary FallbackComponent={ErrorFallback} onReset={reset}>
              <AppRouter />
              <ToastContainer position="top-right" autoClose={2500} />
            </ErrorBoundary>
          )}
        </QueryErrorResetBoundary>
      </QueryClientProvider>
    </AuthProvider>
  </React.StrictMode>,
);

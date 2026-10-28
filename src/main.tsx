import { QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { AuthGate } from '@/features/auth/AuthGate';
import { AuthProvider } from '@/features/auth/AuthProvider';
import { MoviesSync } from '@/features/movies/MoviesSync';
import { queryClient } from '@/lib/queryClient';

import { App } from './app/App';
import './styles/global.css';
import './styles/signin.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AuthGate>
          <BrowserRouter>
            <MoviesSync />
            <App />
          </BrowserRouter>
        </AuthGate>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
);

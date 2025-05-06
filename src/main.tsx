// import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router';
import { router } from './app/router/Routes.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ToastContainer } from 'react-toastify';
import { store, StoreContext } from './lib/stores/store.ts';
import { StrictMode } from 'react';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <StoreContext.Provider value={store}>
            <QueryClientProvider client={queryClient}>
                <ReactQueryDevtools />
                <ToastContainer position='top-right' hideProgressBar={false} pauseOnHover={false} theme='light' />
                <RouterProvider router={router} />
            </QueryClientProvider>
        </StoreContext.Provider>
    </StrictMode>,
);

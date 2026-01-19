import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';
import App from './App';

const queryClient  = new QueryClient({
    defaultOptions: {
        queries:{
            // Don't auto fetch app which user switch back to application
            refetchOnWindowFocus: false,
            //API Retry counts
            retry: 3,
        },
    },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
    // Enabling Dev Checks
    <React.StrictMode>
        {/* To listen URL Changes */}
        <BrowserRouter>
            {/* Server State Management - API Cache */}
            <QueryClientProvider client={queryClient}>
                {/* Actual Application */}
                <App />
            </QueryClientProvider>
        </BrowserRouter>
    </React.StrictMode>
);
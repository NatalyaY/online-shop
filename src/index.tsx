
import React from 'react';
import { Provider } from 'react-redux'
import { hydrateRoot, createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './app/App';
import configureAppStore from './app/store';
import './assets/scss/index.scss';

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { CacheProvider } from '@emotion/react';
import theme from './app/MUITheme';
import createEmotionCache from '../server/controllers/middleware/emotionCache';

const container = document.getElementById('app')!;

const preloadedState = (window as any).__PRELOADED_STATE__ || {};

delete (window as any).__PRELOADED_STATE__

const store = configureAppStore(preloadedState);
const cache = createEmotionCache();

function Main() {
    return (
        <React.StrictMode>
            <CacheProvider value={cache}>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <Provider store={store}>
                        <BrowserRouter>
                            <App />
                        </BrowserRouter>
                    </Provider>
                </ThemeProvider>
            </CacheProvider>
        </React.StrictMode>
    );
}

if (container.children.length) {
    hydrateRoot(container, <Main />);
} else {
    const root = createRoot(document.getElementById('app')!);
    root.render(<Main />);
}


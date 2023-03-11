import { StrictMode } from 'react';

import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';

import '@/main.css';
import { store } from '@/app/store';
import { App } from '@/containers/App';
// import { App2 } from '@/containers/App2';
import { HealthCheck } from '@/containers/HealthCheck';

const persistor = persistStore(store);

const Main = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <Routes>
          <Route path={`/healthcheck`} element={<HealthCheck />} />
          <Route path={`*`} element={<App />} />
        </Routes>
      </BrowserRouter>
    </PersistGate>
  </Provider>
);

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <Main />
  </StrictMode>
);

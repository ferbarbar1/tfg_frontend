import React from "react";
import AppRoutes from './AppRoutes';
import { AuthProvider } from './contexts/AuthContext';
import { OffersProvider } from './contexts/OffersContext';
import { NotificationsProvider } from './contexts/NotificationsContext';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n/i18n';
import { AlertProvider } from './contexts/AlertContext';
import { BrowserRouter as Router } from 'react-router-dom';
//import ScrollToTop from './utils/scrollToTop';

function App() {
  return (
    <div className="App">
      <I18nextProvider i18n={i18n}>
        <AuthProvider>
          <NotificationsProvider>
            <OffersProvider>
              <Router>
                <AlertProvider>
                  <AppRoutes />
                </AlertProvider>
              </Router>
            </OffersProvider>
          </NotificationsProvider>
        </AuthProvider>
      </I18nextProvider>
    </div>
  );
}

export default App;

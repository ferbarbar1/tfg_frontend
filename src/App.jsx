import React from "react";
import AppRoutes from './AppRoutes';
import { AuthProvider } from './contexts/AuthContext';
import { OffersProvider } from './contexts/OffersContext';
import { NotificationsProvider } from './contexts/NotificationsContext';

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <NotificationsProvider>
          <OffersProvider>
            <AppRoutes />
          </OffersProvider>
        </NotificationsProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
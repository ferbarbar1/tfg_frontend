import React from "react";
import AppRoutes from './AppRoutes';
import { AuthProvider } from './contexts/AuthContext';
import { OffersProvider } from './contexts/OffersContext';

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <OffersProvider>
          <AppRoutes />
        </OffersProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
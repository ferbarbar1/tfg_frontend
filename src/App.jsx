import React from "react";
import AppRoutes from './AppRoutes';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </div>
  );
}

export default App;
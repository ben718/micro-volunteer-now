import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom'; // Importer BrowserRouter
import { AuthProvider } from './contexts/AuthContext'; // Importer AuthProvider

createRoot(document.getElementById("root")!).render(
  // Envelopper l'application avec BrowserRouter et AuthProvider
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
);
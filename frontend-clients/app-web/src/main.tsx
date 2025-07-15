import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // No es necesario el .tsx
import './components/ui/index.css';
// La importación ahora apunta al módulo, sin la extensión de archivo.
import { AuthProvider } from './contexts/AuthContext'; 
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeProvider'; 

const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <AuthProvider>
        <BrowserRouter>
          <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <App />
          </ThemeProvider>
        </BrowserRouter>
      </AuthProvider>
    </React.StrictMode>,
  );
} else {
  console.error("Failed to find the root element");
}

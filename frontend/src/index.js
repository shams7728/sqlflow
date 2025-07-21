import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import { ThemeContextProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext'; // Add this import

// Optional: Suppress ResizeObserver warnings in dev
const originalError = console.error;
console.error = (...args) => {
  if (
    args[0] &&
    typeof args[0] === 'string' &&
    args[0].includes('ResizeObserver loop completed')
  ) {
    return;
  }
  originalError(...args);
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <AuthProvider> {/* Wrap with AuthProvider */}
      <ThemeContextProvider>
        <App />
      </ThemeContextProvider>
    </AuthProvider>
  </BrowserRouter>
);
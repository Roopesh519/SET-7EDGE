import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './contexts/AuthContext';

// Suppress Chrome extension messaging errors
const originalConsoleError = console.error;
console.error = (...args) => {
  const errorMessage = args[0]?.toString() || '';
  
  // Filter out Chrome extension messaging errors
  if (
    errorMessage.includes('Failed to initialize messaging: tx_attempts_exceeded') ||
    errorMessage.includes('tx_ack_timeout') ||
    errorMessage.includes('chrome-extension://')
  ) {
    return; // Suppress these errors
  }
  
  // Log all other errors normally
  originalConsoleError.apply(console, args);
};

// Suppress unhandled promise rejections from extensions
window.addEventListener('unhandledrejection', (event) => {
  const errorMessage = event.reason?.toString() || '';
  
  if (
    errorMessage.includes('Failed to initialize messaging: tx_attempts_exceeded') ||
    errorMessage.includes('tx_ack_timeout') ||
    errorMessage.includes('chrome-extension://')
  ) {
    event.preventDefault(); // Prevent the error from showing in console
  }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

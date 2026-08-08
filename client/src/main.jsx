
import { createRoot } from 'react-dom/client'
import './index.css'

// Telemetry script to send frontend errors to backend console
const logErrorToBackend = (errorData) => {
  fetch('/api/log-error', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(errorData)
  }).catch(() => {});
};

window.addEventListener('error', (event) => {
  logErrorToBackend({
    type: 'unhandled_error',
    message: event.message,
    source: event.filename,
    line: event.lineno,
    col: event.colno,
    stack: event.error?.stack || ''
  });
});

window.addEventListener('unhandledrejection', (event) => {
  logErrorToBackend({
    type: 'unhandled_promise_rejection',
    reason: String(event.reason?.message || event.reason),
    stack: event.reason?.stack || ''
  });
});

// Intercept console.error
const originalConsoleError = console.error;
console.error = (...args) => {
  originalConsoleError.apply(console, args);
  logErrorToBackend({
    type: 'console_error',
    arguments: args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ')
  });
};

import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'
import { AppProvider } from './context/AppContext'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key in VITE_CLERK_PUBLISHABLE_KEY")
}

createRoot(document.getElementById('root')).render(
  <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
    <BrowserRouter>
      <AppProvider>
        <App />
      </AppProvider>
    </BrowserRouter>
  </ClerkProvider>,
)

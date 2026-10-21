import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';

// Guard against errors thrown by third-party browser extensions (e.g., MetaMask inpage scripts)
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    const errorMsg = event.message || '';
    const filename = event.filename || '';
    if (
      errorMsg.includes('MetaMask') ||
      filename.includes('chrome-extension://') ||
      filename.includes('nkbihfbeogaeaoehlefnkodbefgpgknn') ||
      (event.error && String(event.error).includes('MetaMask'))
    ) {
      event.preventDefault();
      event.stopPropagation();
      console.warn('Prevented external extension error from bubbling:', errorMsg);
      return true;
    }
  }, true);

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason ? String(event.reason) : '';
    if (
      reason.includes('MetaMask') ||
      reason.includes('Failed to connect to MetaMask') ||
      reason.includes('chrome-extension://')
    ) {
      event.preventDefault();
      event.stopPropagation();
      console.warn('Prevented external extension rejection:', reason);
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);


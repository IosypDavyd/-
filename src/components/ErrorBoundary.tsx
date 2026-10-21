import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw, ShieldCheck } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // If the error comes from an external browser extension like MetaMask injected script,
    // ignore it and don't crash the Solana wallet app.
    const message = error?.message || '';
    const stack = error?.stack || '';
    if (
      message.includes('MetaMask') ||
      stack.includes('chrome-extension://') ||
      stack.includes('nkbihfbeogaeaoehlefnkodbefgpgknn')
    ) {
      console.warn('Ignored external extension error in Solana app:', message);
      return { hasError: false, error: null };
    }
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const message = error?.message || '';
    const stack = error?.stack || '';
    if (
      message.includes('MetaMask') ||
      stack.includes('chrome-extension://') ||
      stack.includes('nkbihfbeogaeaoehlefnkodbefgpgknn')
    ) {
      console.warn('Suppressed unhandled browser extension event:', message, errorInfo);
      return;
    }
    console.error('Uncaught error inside Mysteryum Solana Wallet:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError && this.state.error) {
      return (
        <div className="min-h-screen bg-[#080a0f] text-slate-100 flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-3xl border border-rose-500/30 bg-[#0f1422] p-6 text-center space-y-4 shadow-2xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-950/80 border border-rose-500/40 text-rose-400">
              <AlertTriangle className="h-7 w-7" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-bold text-white">Something went wrong</h2>
              <p className="text-xs text-slate-400 mt-1">
                {this.state.error?.message || 'An unexpected rendering error occurred.'}
              </p>
            </div>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2.5 text-xs font-bold text-white hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/20"
            >
              <RotateCcw className="h-4 w-4" />
              Reload Mysteryum Wallet
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

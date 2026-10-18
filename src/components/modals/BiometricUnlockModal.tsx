import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  Scan,
  Fingerprint,
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Sparkles,
  Smartphone,
  Eye,
  RefreshCw,
  X,
} from 'lucide-react';
import { shortenAddress } from '../../utils/crypto';
import { verifySecurityPin, validateBiometricScan } from '../../utils/biometrics';
import confetti from 'canvas-confetti';

export type BiometricMode = 'face' | 'fingerprint' | 'pin';

interface BiometricUnlockModalProps {
  isOpen: boolean;
  walletAddress: string;
  accountName: string;
  onUnlock: () => void;
  onClose?: () => void;
  canDismiss?: boolean;
}

export const BiometricUnlockModal: React.FC<BiometricUnlockModalProps> = ({
  isOpen,
  walletAddress,
  accountName,
  onUnlock,
  onClose,
  canDismiss = false,
}) => {
  const [mode, setMode] = useState<BiometricMode>('face');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanPhaseText, setScanPhaseText] = useState('Position your face within the frame');
  const [authStatus, setAuthStatus] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  
  // Fingerprint press-and-hold states
  const [isHoldingSensor, setIsHoldingSensor] = useState(false);
  const holdIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // PIN states
  const [pinDigits, setPinDigits] = useState<string>('');
  const [pinErrorShake, setPinErrorShake] = useState(false);

  // Reset state on open or mode switch
  useEffect(() => {
    if (isOpen) {
      setAuthStatus('idle');
      setScanProgress(0);
      setErrorMessage('');
      setPinDigits('');
      if (mode === 'face') {
        setScanPhaseText('Position your face within the reticle');
      } else if (mode === 'fingerprint') {
        setScanPhaseText('Touch the fingerprint sensor to authenticate');
      } else {
        setScanPhaseText('Enter your 4-digit Master Security PIN');
      }
    }
  }, [isOpen, mode]);

  if (!isOpen) return null;

  // --- Face Scan Simulation Flow ---
  const handleStartFaceScan = (simulateFailure = false) => {
    if (isScanning) return;
    setIsScanning(true);
    setAuthStatus('scanning');
    setScanProgress(0);
    setErrorMessage('');

    const phases = [
      { progress: 25, text: 'Detecting facial contours...' },
      { progress: 55, text: 'Mapping 3D biometric landmarks...' },
      { progress: 85, text: 'Verifying with Solana Secure Enclave...' },
      { progress: 100, text: simulateFailure ? 'Biometric Mismatch' : 'Identity Confirmed!' },
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < phases.length) {
        setScanProgress(phases[currentStep].progress);
        setScanPhaseText(phases[currentStep].text);
      } else {
        clearInterval(interval);
        setIsScanning(false);
        const qualityScore = simulateFailure ? 45 : 98;
        const evaluation = validateBiometricScan(qualityScore, 70);

        if (evaluation.success) {
          setAuthStatus('success');
          setScanPhaseText('Vault Decrypted Successfully');
          try {
            confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
          } catch {
            // ignore
          }
          setTimeout(() => {
            onUnlock();
          }, 1000);
        } else {
          setAuthStatus('error');
          setErrorMessage(evaluation.message);
          setScanPhaseText('Face scan failed. Retry or use PIN');
        }
      }
    }, 450);
  };

  // --- Fingerprint Touch / Hold Simulation Flow ---
  const startFingerprintHold = (simulateFailure = false) => {
    if (authStatus === 'success') return;
    setIsHoldingSensor(true);
    setAuthStatus('scanning');
    setErrorMessage('');

    let progress = 0;
    holdIntervalRef.current = setInterval(() => {
      progress += 10;
      setScanProgress(progress);
      if (progress === 30) setScanPhaseText('Scanning epidermal ridges...');
      if (progress === 70) setScanPhaseText('Decrypting hardware key...');

      if (progress >= 100) {
        if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
        setIsHoldingSensor(false);

        if (simulateFailure) {
          setAuthStatus('error');
          setErrorMessage('Fingerprint unverified. Sensor smudge detected');
          setScanPhaseText('Touch ID failed. Try again or enter PIN');
        } else {
          setAuthStatus('success');
          setScanPhaseText('Fingerprint Authenticated!');
          try {
            confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
          } catch {
            // ignore
          }
          setTimeout(() => {
            onUnlock();
          }, 900);
        }
      }
    }, 120);
  };

  const endFingerprintHold = () => {
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
    setIsHoldingSensor(false);
    if (scanProgress < 100 && authStatus === 'scanning') {
      setAuthStatus('idle');
      setScanProgress(0);
      setScanPhaseText('Hold your finger longer on the sensor');
    }
  };

  // --- PIN Keypad Flow ---
  const handleKeypadPress = (num: string) => {
    if (pinDigits.length >= 4) return;
    const nextPin = pinDigits + num;
    setPinDigits(nextPin);
    setErrorMessage('');

    if (nextPin.length === 4) {
      const isValid = verifySecurityPin(nextPin, '4190');
      if (isValid) {
        setAuthStatus('success');
        try {
          confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
        } catch {
          // ignore
        }
        setTimeout(() => {
          onUnlock();
        }, 900);
      } else {
        setPinErrorShake(true);
        setAuthStatus('error');
        setErrorMessage('Incorrect PIN code. Try 4190 (default)');
        setTimeout(() => {
          setPinErrorShake(false);
          setPinDigits('');
        }, 700);
      }
    }
  };

  const handleBackspace = () => {
    setPinDigits((prev) => prev.slice(0, -1));
    setErrorMessage('');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="biometric-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-2xl p-4 animate-in fade-in duration-300"
    >
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-80 w-80 rounded-full bg-cyan-500/15 blur-[90px]" />
      <div className="pointer-events-none absolute -bottom-24 left-1/2 -translate-x-1/2 h-80 w-80 rounded-full bg-emerald-500/15 blur-[90px]" />

      <div className="relative w-full max-w-sm rounded-3xl border border-white/10 bg-[#0c101a]/95 p-6 shadow-2xl text-center space-y-5">
        {canDismiss && onClose && (
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 rounded-xl p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        {/* Top Header Badge */}
        <div className="flex flex-col items-center">
          <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-500/20 via-indigo-500/20 to-purple-500/20 border border-cyan-500/40 text-cyan-400 shadow-lg shadow-cyan-500/10 mb-3">
            {authStatus === 'success' ? (
              <CheckCircle2 className="h-8 w-8 text-emerald-400 animate-in zoom-in duration-200" />
            ) : mode === 'face' ? (
              <Scan className="h-7 w-7 text-cyan-400" />
            ) : mode === 'fingerprint' ? (
              <Fingerprint className="h-7 w-7 text-cyan-400" />
            ) : (
              <KeyRound className="h-7 w-7 text-cyan-400" />
            )}
            <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-[#0c101a]">
              <Lock className="h-2.5 w-2.5 text-black" />
            </span>
          </div>

          <span className="font-mono text-[10px] font-bold tracking-widest text-cyan-400 uppercase">
            SOLANA SECURE ENCLAVE
          </span>
          <h2 id="biometric-modal-title" className="font-heading text-lg font-bold text-white mt-0.5">
            Biometric Unlock Required
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Authenticate to reveal portfolio balances and decrypt your local keys.
          </p>

          <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-slate-900/90 border border-white/10 px-3 py-0.5 text-[11px] font-mono text-slate-300">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
            <span>{accountName}</span>
            <span className="text-slate-500">·</span>
            <span className="text-cyan-300">{shortenAddress(walletAddress, 4)}</span>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-3 gap-1.5 rounded-2xl bg-slate-900/80 p-1 border border-white/5">
          <button
            type="button"
            onClick={() => setMode('face')}
            className={`flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold transition-all cursor-pointer ${
              mode === 'face'
                ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Scan className="h-3.5 w-3.5" />
            <span>Face ID</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('fingerprint')}
            className={`flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold transition-all cursor-pointer ${
              mode === 'fingerprint'
                ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Fingerprint className="h-3.5 w-3.5" />
            <span>Touch ID</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('pin')}
            className={`flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold transition-all cursor-pointer ${
              mode === 'pin'
                ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <KeyRound className="h-3.5 w-3.5" />
            <span>PIN Code</span>
          </button>
        </div>

        {/* Main Interactive Scan Area */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 min-h-[220px] flex flex-col items-center justify-center relative overflow-hidden">
          {/* Status Message */}
          <p
            className={`text-xs font-semibold mb-3 ${
              authStatus === 'success'
                ? 'text-emerald-400'
                : authStatus === 'error'
                ? 'text-rose-400'
                : 'text-slate-300'
            }`}
          >
            {scanPhaseText}
          </p>

          {/* TAB 1: Face ID Viewfinder */}
          {mode === 'face' && (
            <div className="flex flex-col items-center space-y-4 w-full">
              {/* Reticle Viewfinder */}
              <div className="relative h-28 w-28 rounded-2xl border-2 border-dashed border-cyan-500/50 flex items-center justify-center overflow-hidden bg-black/40">
                {/* Reticle corner brackets */}
                <span className="absolute top-1 left-1 h-3 w-3 border-t-2 border-l-2 border-cyan-400" />
                <span className="absolute top-1 right-1 h-3 w-3 border-t-2 border-r-2 border-cyan-400" />
                <span className="absolute bottom-1 left-1 h-3 w-3 border-b-2 border-l-2 border-cyan-400" />
                <span className="absolute bottom-1 right-1 h-3 w-3 border-b-2 border-r-2 border-cyan-400" />

                {/* Simulated Wireframe Face */}
                <svg
                  viewBox="0 0 100 100"
                  className={`h-20 w-20 transition-all ${
                    authStatus === 'success'
                      ? 'text-emerald-400'
                      : isScanning
                      ? 'text-cyan-400 animate-pulse'
                      : 'text-slate-500'
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="50" cy="50" r="38" strokeDasharray="3 3" />
                  <ellipse cx="50" cy="48" rx="24" ry="30" />
                  <circle cx="42" cy="42" r="3" fill="currentColor" />
                  <circle cx="58" cy="42" r="3" fill="currentColor" />
                  <path d="M 50 45 L 50 55 L 46 58" />
                  <path d="M 40 65 Q 50 72 60 65" />
                </svg>

                {/* Laser scan line */}
                {isScanning && (
                  <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#22d3ee] animate-bounce" />
                )}
              </div>

              {/* Progress Bar */}
              {isScanning && (
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-cyan-400 to-emerald-400 h-full transition-all duration-300"
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="w-full space-y-2">
                <button
                  type="button"
                  onClick={() => handleStartFaceScan(false)}
                  disabled={isScanning || authStatus === 'success'}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-emerald-500 hover:opacity-90 py-2.5 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isScanning ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      <span>Scanning Face...</span>
                    </>
                  ) : authStatus === 'success' ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-white" />
                      <span>Unlocked!</span>
                    </>
                  ) : (
                    <>
                      <Scan className="h-4 w-4" />
                      <span>Scan Face to Unlock</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleStartFaceScan(true)}
                  disabled={isScanning}
                  className="w-full text-center text-[10px] text-slate-500 hover:text-rose-400 transition-colors"
                >
                  Simulate Failed Scan (Test Security Shake)
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: Touch ID Sensor */}
          {mode === 'fingerprint' && (
            <div className="flex flex-col items-center space-y-4 w-full">
              {/* Concentric Fingerprint Scanner */}
              <button
                type="button"
                onMouseDown={() => startFingerprintHold(false)}
                onMouseUp={endFingerprintHold}
                onTouchStart={() => startFingerprintHold(false)}
                onTouchEnd={endFingerprintHold}
                className={`relative flex h-24 w-24 items-center justify-center rounded-full border-2 transition-all cursor-pointer select-none ${
                  isHoldingSensor
                    ? 'border-cyan-400 bg-cyan-950/80 shadow-[0_0_30px_rgba(6,182,212,0.5)] scale-95'
                    : authStatus === 'success'
                    ? 'border-emerald-400 bg-emerald-950/80 shadow-[0_0_30px_rgba(52,211,153,0.5)]'
                    : 'border-white/20 bg-black/40 hover:border-cyan-500/60'
                }`}
              >
                {/* SVG Fingerprint Ridges */}
                <Fingerprint
                  className={`h-12 w-12 transition-all ${
                    authStatus === 'success'
                      ? 'text-emerald-400 scale-110'
                      : isHoldingSensor
                      ? 'text-cyan-300 animate-pulse'
                      : 'text-slate-400'
                  }`}
                />

                {/* Glowing Circular Progress Ring */}
                {isHoldingSensor && (
                  <svg className="absolute inset-0 h-full w-full -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="44"
                      fill="none"
                      stroke="#22d3ee"
                      strokeWidth="3"
                      strokeDasharray={276}
                      strokeDashoffset={276 - (276 * scanProgress) / 100}
                      className="transition-all duration-100"
                    />
                  </svg>
                )}
              </button>

              <p className="text-[11px] text-slate-400 font-medium">
                {isHoldingSensor ? `Hold on sensor... ${scanProgress}%` : 'Press & hold sensor to authenticate'}
              </p>

              {/* Instant Tap Scan button for quick unlocking */}
              <div className="w-full space-y-1.5">
                <button
                  type="button"
                  onClick={() => startFingerprintHold(false)}
                  className="w-full rounded-xl bg-slate-800 hover:bg-slate-700 py-2 text-xs font-bold text-cyan-300 transition-colors"
                >
                  Quick Scan Fingerprint
                </button>
                <button
                  type="button"
                  onClick={() => startFingerprintHold(true)}
                  className="w-full text-center text-[10px] text-slate-500 hover:text-rose-400 transition-colors"
                >
                  Simulate Smudged Fingerprint (Fail)
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: Security PIN Keypad */}
          {mode === 'pin' && (
            <div className={`flex flex-col items-center space-y-3 w-full ${pinErrorShake ? 'animate-shake' : ''}`}>
              {/* 4-digit PIN circles */}
              <div className="flex items-center gap-3 my-1">
                {[0, 1, 2, 3].map((idx) => {
                  const filled = pinDigits.length > idx;
                  return (
                    <div
                      key={idx}
                      className={`h-3.5 w-3.5 rounded-full border transition-all ${
                        filled
                          ? 'bg-cyan-400 border-cyan-400 shadow-[0_0_10px_#22d3ee]'
                          : 'border-slate-600 bg-slate-800'
                      }`}
                    />
                  );
                })}
              </div>

              {/* Number Keypad */}
              <div className="grid grid-cols-3 gap-1.5 w-full max-w-[200px]">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => handleKeypadPress(n)}
                    className="flex h-10 items-center justify-center rounded-xl bg-slate-800/80 text-sm font-bold text-white hover:bg-slate-700 hover:text-cyan-300 transition-colors cursor-pointer"
                  >
                    {n}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setPinDigits('')}
                  className="flex h-10 items-center justify-center rounded-xl bg-slate-900 text-[10px] font-bold text-slate-400 hover:text-white"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={() => handleKeypadPress('0')}
                  className="flex h-10 items-center justify-center rounded-xl bg-slate-800/80 text-sm font-bold text-white hover:bg-slate-700 hover:text-cyan-300"
                >
                  0
                </button>
                <button
                  type="button"
                  onClick={handleBackspace}
                  className="flex h-10 items-center justify-center rounded-xl bg-slate-900 text-xs font-bold text-slate-400 hover:text-rose-400"
                >
                  ⌫
                </button>
              </div>

              <p className="text-[10px] text-slate-500 font-mono">
                Default Master PIN: <strong className="text-cyan-400 font-bold">4190</strong>
              </p>
            </div>
          )}
        </div>

        {/* Error message badge */}
        {errorMessage && (
          <div className="flex items-center justify-center gap-1.5 rounded-xl bg-rose-500/15 border border-rose-500/30 p-2 text-[11px] text-rose-300">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Footer info */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
          <ShieldCheck className="h-3.5 w-3.5 text-cyan-500" />
          <span>Protected by WebAuthn & Local Keychain Encryption</span>
        </div>
      </div>
    </div>
  );
};

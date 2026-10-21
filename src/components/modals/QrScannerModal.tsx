import React, { useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';
import {
  Camera,
  CameraOff,
  X,
  ScanLine,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Upload,
} from 'lucide-react';
import { extractSolanaAddressFromQr } from '../../utils/qrParser';

interface QrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (solanaAddress: string) => void;
}

export const QrScannerModal: React.FC<QrScannerModalProps> = ({
  isOpen,
  onClose,
  onScanSuccess,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');

  const animationFrameId = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Stop video stream safely
  const stopStream = () => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  // Start camera stream
  const startCamera = async (mode: 'environment' | 'user') => {
    stopStream();
    setCameraError(null);
    setScannedResult(null);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported on this browser or platform');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: mode, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });

      streamRef.current = stream;
      setHasCameraPermission(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
        setIsScanning(true);
        requestAnimationFrame(scanVideoFrame);
      }
    } catch (err: any) {
      console.warn('Camera stream error:', err);
      setHasCameraPermission(false);
      setCameraError(
        err.name === 'NotAllowedError'
          ? 'Camera permission denied. Please allow camera access in your browser settings or upload a QR image below.'
          : err.message || 'Unable to access device camera. You can upload an image with a QR code instead.'
      );
    }
  };

  // Process live video frames using jsQR
  const scanVideoFrame = () => {
    if (!videoRef.current || !canvasRef.current || videoRef.current.readyState !== videoRef.current.HAVE_ENOUGH_DATA) {
      animationFrameId.current = requestAnimationFrame(scanVideoFrame);
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: 'attemptBoth',
    });

    if (code && code.data) {
      const extractedAddress = extractSolanaAddressFromQr(code.data);
      if (extractedAddress) {
        // Success found!
        stopStream();
        setScannedResult(extractedAddress);
        setTimeout(() => {
          onScanSuccess(extractedAddress);
          onClose();
        }, 500);
        return;
      }
    }

    animationFrameId.current = requestAnimationFrame(scanVideoFrame);
  };

  // Fallback: Upload QR code image from file system
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'attemptBoth',
        });

        if (code && code.data) {
          const extractedAddress = extractSolanaAddressFromQr(code.data);
          if (extractedAddress) {
            setScannedResult(extractedAddress);
            setTimeout(() => {
              onScanSuccess(extractedAddress);
              onClose();
            }, 500);
            return;
          }
        }
        setCameraError('No valid Solana QR code detected in the uploaded image.');
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Lifecycle when open
  useEffect(() => {
    if (isOpen) {
      startCamera(facingMode);
    } else {
      stopStream();
    }
    return () => {
      stopStream();
    };
  }, [isOpen, facingMode]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-cyan-500/40 bg-gradient-to-b from-[#0e1628] to-[#080d16] p-6 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer z-20"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 shadow-md shadow-cyan-950">
            <Camera className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-heading text-base font-bold text-white flex items-center gap-2">
              <span>Scan Solana QR Code</span>
              <span className="rounded bg-cyan-950 border border-cyan-500/30 px-1.5 py-0.2 text-[9px] font-mono text-cyan-300">
                CAMERA
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Point your camera at a recipient Solana QR code
            </p>
          </div>
        </div>

        {/* Camera Viewfinder Container */}
        <div className="relative mx-auto aspect-square w-full max-w-[320px] overflow-hidden rounded-2xl border-2 border-cyan-500/30 bg-black/90 shadow-inner flex items-center justify-center">
          {/* HTML5 Video element */}
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            muted
            playsInline
          />

          {/* Offscreen Canvas for jsQR frame sampling */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Scanning Reticle & Aim Overlay */}
          {!scannedResult && !cameraError && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              {/* Target Aim box */}
              <div className="relative h-48 w-48 rounded-2xl border-2 border-dashed border-cyan-400/80 shadow-[0_0_20px_rgba(34,211,238,0.25)]">
                {/* Corner markers */}
                <span className="absolute -left-1 -top-1 h-4 w-4 border-l-2 border-t-2 border-cyan-300" />
                <span className="absolute -right-1 -top-1 h-4 w-4 border-r-2 border-t-2 border-cyan-300" />
                <span className="absolute -left-1 -bottom-1 h-4 w-4 border-l-2 border-b-2 border-cyan-300" />
                <span className="absolute -right-1 -bottom-1 h-4 w-4 border-r-2 border-b-2 border-cyan-300" />

                {/* Animated Scan Line */}
                <div className="absolute inset-x-2 top-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse shadow-[0_0_8px_#22d3ee]" />
              </div>
            </div>
          )}

          {/* Scanned Success Feedback */}
          {scannedResult && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-emerald-950/90 backdrop-blur-sm p-4 text-center animate-in zoom-in-95 duration-200">
              <CheckCircle2 className="h-12 w-12 text-emerald-400 mb-2 animate-bounce" />
              <h4 className="font-heading text-sm font-bold text-white">Address Detected!</h4>
              <p className="mt-1 font-mono text-[11px] text-emerald-300 break-all px-2 bg-black/40 py-1.5 rounded-lg border border-emerald-500/30">
                {scannedResult}
              </p>
              <p className="mt-2 text-xs text-slate-300">Populating send recipient...</p>
            </div>
          )}

          {/* Error / Fallback State */}
          {cameraError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0d121f]/95 p-4 text-center space-y-3">
              <CameraOff className="h-10 w-10 text-amber-400" />
              <p className="text-xs text-amber-200/90 leading-relaxed px-2">{cameraError}</p>
              <button
                type="button"
                onClick={() => startCamera(facingMode)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 px-3 py-1.5 text-xs text-cyan-300 border border-white/10 transition-colors cursor-pointer"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Retry Camera</span>
              </button>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="mt-4 flex items-center justify-between gap-2">
          {/* Switch Camera */}
          <button
            type="button"
            onClick={() => setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'))}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-slate-900/80 hover:bg-slate-800 px-3 py-2 text-xs font-medium text-slate-300 transition-colors cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5 text-cyan-400" />
            <span>Flip Camera ({facingMode === 'environment' ? 'Back' : 'Front'})</span>
          </button>

          {/* File Upload Alternative */}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 rounded-xl border border-cyan-500/40 bg-cyan-950/60 hover:bg-cyan-900/60 px-3 py-2 text-xs font-bold text-cyan-300 transition-colors cursor-pointer shadow-sm shadow-cyan-950"
              title="Upload image containing a QR code"
            >
              <Upload className="h-3.5 w-3.5" />
              <span>Upload QR Image</span>
            </button>
          </div>
        </div>

        <p className="mt-3 text-center text-[10px] font-mono text-slate-500">
          Supports Base58 addresses & solana: URI standard schemes
        </p>
      </div>
    </div>
  );
};

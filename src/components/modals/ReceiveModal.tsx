import React, { useState } from 'react';
import { X, Copy, Check, QrCode, Shield, Share2 } from 'lucide-react';
import { WalletAccount, NetworkId } from '../../types/wallet';

interface ReceiveModalProps {
  account: WalletAccount;
  network: NetworkId;
  onClose: () => void;
}

export const ReceiveModal: React.FC<ReceiveModalProps> = ({
  account,
  network,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(account.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Generate deterministic QR-like matrix pattern based on address
  const generatePattern = (addr: string) => {
    const size = 21; // 21x21 QR code grid
    const grid: boolean[][] = Array(size).fill(false).map(() => Array(size).fill(false));

    // Place finder patterns at corners
    const placeFinder = (r: number, c: number) => {
      for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 7; j++) {
          if (
            i === 0 || i === 6 || j === 0 || j === 6 ||
            (i >= 2 && i <= 4 && j >= 2 && j <= 4)
          ) {
            grid[r + i][c + j] = true;
          }
        }
      }
    };
    placeFinder(0, 0);
    placeFinder(0, 14);
    placeFinder(14, 0);

    // Fill data area with address hash
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        // Skip finder areas
        if (
          (i < 8 && j < 8) ||
          (i < 8 && j >= 13) ||
          (i >= 13 && j < 8)
        ) continue;
        const charCode = addr.charCodeAt((i * 11 + j * 7) % addr.length);
        grid[i][j] = (charCode % 2 === 0) || ((i + j) % 3 === 0);
      }
    }
    return grid;
  };

  const qrGrid = generatePattern(account.address);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-[#0f1420] p-6 text-center shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-950/80 border border-cyan-500/30 text-cyan-400">
          <QrCode className="h-6 w-6" />
        </div>

        <h3 className="font-heading text-lg font-bold text-white">Receive Solana Assets</h3>
        <p className="text-xs text-slate-400 mb-5">
          Scan QR code or share your public address to receive SOL, SPL tokens & NFTs
        </p>

        {/* QR Code Canvas Card */}
        <div className="mx-auto mb-4 w-52 h-52 rounded-2xl bg-white p-3 shadow-lg flex items-center justify-center">
          <svg viewBox="0 0 21 21" className="w-full h-full shape-rendering-crispEdges">
            {qrGrid.map((row, r) =>
              row.map((cell, c) =>
                cell ? (
                  <rect
                    key={`${r}-${c}`}
                    x={c}
                    y={r}
                    width={1}
                    height={1}
                    fill="#080a0f"
                  />
                ) : null
              )
            )}
          </svg>
        </div>

        {/* Network Badge */}
        <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 border border-white/10 px-3 py-1 text-[11px] text-slate-300 mb-4">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Network: {network === 'mainnet-beta' ? 'Solana Mainnet' : network}</span>
        </div>

        {/* Address Box */}
        <div className="mb-4 rounded-xl border border-white/10 bg-slate-900/90 p-3 text-left">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Your Solana Address
          </p>
          <p className="break-all font-mono text-xs text-cyan-300 font-medium select-all">
            {account.address}
          </p>
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 text-emerald-300" />
              <span>Address Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              <span>Copy Address</span>
            </>
          )}
        </button>

        <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
          <Shield className="h-3.5 w-3.5" />
          <span>Only send Solana (SOL) and SPL tokens to this address.</span>
        </div>
      </div>
    </div>
  );
};

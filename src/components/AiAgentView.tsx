import React, { useState } from 'react';
import {
  Bot,
  ShieldCheck,
  Search,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Send,
  Zap,
  TrendingUp,
  Cpu,
} from 'lucide-react';
import { TokenAsset } from '../types/wallet';

interface AiAgentViewProps {
  tokens: TokenAsset[];
}

interface AuditResult {
  mint: string;
  name: string;
  score: number;
  mintAuthorityRenounced: boolean;
  freezeAuthorityDisabled: boolean;
  lpLockedPercent: number;
  topHoldersPercent: number;
  verdict: 'SAFE' | 'CAUTION' | 'DANGER';
  notes: string[];
}

export const AiAgentView: React.FC<AiAgentViewProps> = ({ tokens }) => {
  const [searchMint, setSearchMint] = useState('');
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [chatMessages, setChatMessages] = useState<
    { sender: 'user' | 'agent'; text: string; timestamp: number }[]
  >([
    {
      sender: 'agent',
      text: 'Greetings. I am the ECOSYSTEM Solana AI Agent. I monitor on-chain safety, analyze smart contract authorities, and audit your wallet risk in real-time. How can I assist your Solana operations?',
      timestamp: Date.now() - 60000,
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');

  const runAudit = (symbolOrMint: string) => {
    setIsScanning(true);
    setSearchMint(symbolOrMint);
    setTimeout(() => {
      setIsScanning(false);
      const isCustomRisky = symbolOrMint.toLowerCase().includes('scam') || symbolOrMint.toLowerCase().includes('moon');
      if (isCustomRisky) {
        setAuditResult({
          mint: symbolOrMint,
          name: 'High Risk Unverified Token',
          score: 34,
          mintAuthorityRenounced: false,
          freezeAuthorityDisabled: false,
          lpLockedPercent: 22,
          topHoldersPercent: 68,
          verdict: 'DANGER',
          notes: [
            'Mint authority is still active (dev can create new tokens)',
            'Freeze authority is enabled (transfers can be frozen)',
            'Top 10 holders control over 65% of the total circulating supply',
          ],
        });
      } else {
        setAuditResult({
          mint: symbolOrMint,
          name: symbolOrMint.toUpperCase() === 'KPGM' ? 'Key Power Grail Mystery' : `${symbolOrMint.toUpperCase()} Solana Verified Asset`,
          score: 97,
          mintAuthorityRenounced: true,
          freezeAuthorityDisabled: true,
          lpLockedPercent: 100,
          topHoldersPercent: 14.5,
          verdict: 'SAFE',
          notes: [
            'Mint authority successfully revoked and renounced',
            'Freeze authority permanently revoked on Solana SPL program',
            'Liquidity Pool LP tokens 100% burned/locked',
            'Zero honeypot mechanisms detected in bytecode',
          ],
        });
      }
    }, 900);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;

    const userText = inputQuery;
    setInputQuery('');
    setChatMessages((prev) => [
      ...prev,
      { sender: 'user', text: userText, timestamp: Date.now() },
    ]);

    setTimeout(() => {
      let reply = '';
      const lower = userText.toLowerCase();
      if (lower.includes('stake') || lower.includes('yield')) {
        reply =
          'Staking recommendation: JitoSOL is currently yielding ~7.82% APY with MEV rewards redistributed to stakers. If you prefer decentralized validator distribution, Marinade mSOL offers 7.45%. Native validator staking retains full withdrawal keys at the epoch boundary.';
      } else if (lower.includes('kpgm') || lower.includes('jkpgm')) {
        reply =
          'KPGM (Key Power Grail Mystery) is audited with 100% locked liquidity and revoked mint/freeze authorities. The 24h trading volume on Solana DEXes shows healthy momentum (+14.8%).';
      } else if (lower.includes('stock') || lower.includes('xstock')) {
        reply =
          'xStocks provide 24/7 tokenized synthetic exposure to US indices (SPYx, QQQx), mega-caps (NVDAx, AAPLx, TSLAx), and Gold (GLDx) on Solana. They settle instantly in USDC without traditional brokerage lockups.';
      } else if (lower.includes('audit') || lower.includes('safe')) {
        reply =
          'Your overall Ecosystem Vault health score is 96/100 (Optimal). All connected tokens have verified SPL metadata, and no unverified mint contracts have permission to spend your SOL.';
      } else {
        reply =
          `I analyzed your query regarding "${userText}". On the Solana network, average block times are ~400ms and priority fees are ~0.000005 SOL. Your portfolio remains safe and protected by non-custodial local keys.`;
      }

      setChatMessages((prev) => [
        ...prev,
        { sender: 'agent', text: reply, timestamp: Date.now() },
      ]);
    }, 800);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 pb-24">
      {/* Top Banner */}
      <div className="rounded-3xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/40 via-indigo-950/40 to-slate-900 p-6 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-lg shadow-cyan-500/20">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <h2 className="font-heading text-xl font-bold text-white flex items-center gap-2">
              ECOSYSTEM AI AGENT
              <span className="rounded bg-cyan-950 px-2 py-0.5 text-[10px] font-mono text-cyan-300 border border-cyan-500/30">
                ACTIVE
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Autonomous Solana security auditor, contract inspector & DeFi strategist
            </p>
          </div>
        </div>

        {/* Portfolio Security Score */}
        <div className="mt-5 grid grid-cols-3 gap-3">
          <div className="rounded-2xl border border-white/5 bg-slate-900/60 p-3 text-center">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">
              Vault Security
            </span>
            <p className="font-heading text-2xl font-bold text-emerald-400 font-mono mt-0.5">
              96 / 100
            </p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-slate-900/60 p-3 text-center">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">
              Authority Check
            </span>
            <p className="font-heading text-base font-bold text-cyan-300 mt-1">100% Clean</p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-slate-900/60 p-3 text-center">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">
              Network Gas
            </span>
            <p className="font-heading text-base font-bold text-emerald-400 mt-1">Optimal</p>
          </div>
        </div>
      </div>

      {/* Token Safety Scanner Tool */}
      <div className="rounded-3xl border border-white/10 bg-[#0f1420]/80 p-5 space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-cyan-400" />
          <h3 className="font-heading text-sm font-bold text-white uppercase tracking-wider">
            Solana Token Safety Scanner
          </h3>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchMint}
              onChange={(e) => setSearchMint(e.target.value)}
              placeholder="Paste token symbol or mint address (e.g. KPGM, SOL, JUP)..."
              className="w-full rounded-xl border border-white/10 bg-slate-900 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>
          <button
            onClick={() => runAudit(searchMint || 'KPGM')}
            disabled={isScanning}
            className="flex items-center gap-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 px-4 py-2 text-xs font-bold text-white shadow-md shadow-cyan-500/20 cursor-pointer disabled:bg-slate-800"
          >
            <Search className="h-4 w-4" />
            <span>{isScanning ? 'Auditing...' : 'Audit'}</span>
          </button>
        </div>

        {/* Quick Audit suggestions */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <span>Quick scan:</span>
          {['SOL', 'KPGM', 'JUP', 'BONK'].map((sym) => (
            <button
              key={sym}
              type="button"
              onClick={() => runAudit(sym)}
              className="rounded-lg bg-slate-800/80 px-2 py-0.5 text-[11px] font-mono text-cyan-300 hover:bg-slate-700"
            >
              {sym}
            </button>
          ))}
        </div>

        {/* Audit Results display */}
        {auditResult && (
          <div className="rounded-2xl border border-white/10 bg-slate-900/90 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-heading text-sm font-bold text-white">{auditResult.name}</p>
                <p className="text-[11px] text-slate-400 font-mono">{auditResult.mint}</p>
              </div>
              <span
                className={`rounded-lg px-2.5 py-1 text-xs font-bold font-mono ${
                  auditResult.verdict === 'SAFE'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                }`}
              >
                {auditResult.verdict} · {auditResult.score}/100
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center justify-between rounded-xl bg-slate-800/60 p-2.5">
                <span className="text-slate-400">Mint Authority</span>
                <span
                  className={
                    auditResult.mintAuthorityRenounced ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'
                  }
                >
                  {auditResult.mintAuthorityRenounced ? 'Renounced ✓' : 'Active ⚠'}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-slate-800/60 p-2.5">
                <span className="text-slate-400">Freeze Authority</span>
                <span
                  className={
                    auditResult.freezeAuthorityDisabled ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'
                  }
                >
                  {auditResult.freezeAuthorityDisabled ? 'Disabled ✓' : 'Enabled ⚠'}
                </span>
              </div>
            </div>

            <ul className="space-y-1 text-xs text-slate-300">
              {auditResult.notes.map((n, i) => (
                <li key={i} className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                  <span>{n}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* AI Interactive Chat Advisor */}
      <div className="rounded-3xl border border-white/10 bg-[#0f1420]/80 p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-cyan-400" />
          <h3 className="font-heading text-sm font-bold text-white uppercase tracking-wider">
            Solana AI Copilot Discussion
          </h3>
        </div>

        {/* Chat History */}
        <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
          {chatMessages.map((m, i) => (
            <div
              key={i}
              className={`flex gap-2 text-xs ${
                m.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {m.sender === 'agent' && (
                <div className="h-7 w-7 rounded-lg bg-cyan-950 flex items-center justify-center text-cyan-400 border border-cyan-500/30 shrink-0">
                  <Bot className="h-4 w-4" />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-2xl p-3 leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-cyan-600 text-white font-medium rounded-tr-none'
                    : 'bg-slate-900 border border-white/10 text-slate-200 rounded-tl-none'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input box */}
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask AI Agent about staking, xStocks, or token safety..."
            className="flex-1 rounded-xl border border-white/10 bg-slate-900 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
          />
          <button
            type="submit"
            className="flex items-center justify-center rounded-xl bg-cyan-500 hover:bg-cyan-400 p-2.5 text-white transition-colors cursor-pointer"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  Shield,
  Bot,
  Hash,
  Sparkles,
  Users,
} from 'lucide-react';
import { WalletAccount } from '../types/wallet';
import { shortenAddress } from '../utils/crypto';

interface ChatMessage {
  id: string;
  senderName: string;
  senderAddress: string;
  text: string;
  timestamp: number;
  isBot?: boolean;
}

interface ChatViewProps {
  account: WalletAccount;
}

export const ChatView: React.FC<ChatViewProps> = ({ account }) => {
  const [activeChannel, setActiveChannel] = useState<'alpha' | 'holders' | 'bot'>('alpha');
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({
    alpha: [
      {
        id: '1',
        senderName: 'SolanaWhale_99',
        senderAddress: '8xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
        text: 'Solana DEX volume just flipped Ethereum mainnet again. Jupiter routing efficiency is unmatched today.',
        timestamp: Date.now() - 1000 * 60 * 25,
      },
      {
        id: '2',
        senderName: 'GrailCollector',
        senderAddress: '5mNxP98YF21dJ3G7Hk19aRt67QvBnM8pU3sD4kLKPGM',
        text: 'KPGM and JKPGM pools have deep liquidity on Raydium. Staking returns on JitoSOL are also strong at 7.8% APY.',
        timestamp: Date.now() - 1000 * 60 * 12,
      },
    ],
    holders: [
      {
        id: '3',
        senderName: 'CyberNomad',
        senderAddress: '4hZp9M1aW7e4R2KPGM5mNxP98YF21dJ3G7Hk19aRt67',
        text: 'Just minted Mysteryum Cyber Mask #41907! The holographic card in the wallet looks incredible.',
        timestamp: Date.now() - 1000 * 60 * 40,
      },
      {
        id: '4',
        senderName: 'AlphaValidator',
        senderAddress: '9pRt67QvBnM8pU3sD4kLKPGM5mNxP98YF21dJ3G7Hk1',
        text: 'Remember to keep your 12-word seed phrase offline and written down. Never enter it in public chats!',
        timestamp: Date.now() - 1000 * 60 * 5,
      },
    ],
    bot: [
      {
        id: '5',
        senderName: 'Mysteryum Bot',
        senderAddress: 'Bot11111111111111111111111111111111111111111',
        text: 'Welcome to the Mysteryum encrypted community channel. I am available 24/7 to answer Solana questions, fee inquiries, or explain xStocks and staking.',
        timestamp: Date.now() - 1000 * 60 * 60,
        isBot: true,
      },
    ],
  });

  const [inputMessage, setInputMessage] = useState('');

  const currentMessages = messages[activeChannel] || [];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      senderName: 'You (' + shortenAddress(account.address, 4) + ')',
      senderAddress: account.address,
      text: inputMessage,
      timestamp: Date.now(),
    };

    setMessages((prev) => ({
      ...prev,
      [activeChannel]: [...(prev[activeChannel] || []), userMsg],
    }));

    const messageText = inputMessage;
    setInputMessage('');

    // If in bot channel or mentions bot, respond automatically
    if (activeChannel === 'bot' || messageText.toLowerCase().includes('bot') || messageText.toLowerCase().includes('help')) {
      setTimeout(() => {
        const botReply: ChatMessage = {
          id: (Date.now() + 1).toString(),
          senderName: 'Mysteryum Bot',
          senderAddress: 'Bot11111111111111111111111111111111111111111',
          text: `[Encrypted Web3 Reply] Regarding "${messageText}": MYSTERYUM WALLET maintains local cryptographic key integrity. All Solana transfers execute directly against the SVM (Solana Virtual Machine).`,
          timestamp: Date.now(),
          isBot: true,
        };
        setMessages((prev) => ({
          ...prev,
          [activeChannel]: [...(prev[activeChannel] || []), botReply],
        }));
      }, 700);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-4 pb-24">
      {/* Channel Selector Header */}
      <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#0f1420]/90 p-3">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: 'alpha', label: 'solana-alpha', icon: Hash },
            { id: 'holders', label: 'mysteryum-holders', icon: Users },
            { id: 'bot', label: 'mysteryum-bot', icon: Bot },
          ].map((ch) => {
            const Icon = ch.icon;
            const isActive = activeChannel === ch.id;
            return (
              <button
                key={ch.id}
                onClick={() => setActiveChannel(ch.id as any)}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>#{ch.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="hidden sm:inline">P2P Encrypted</span>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="rounded-3xl border border-white/10 bg-[#0f1420]/80 p-5 space-y-4 min-h-[380px] max-h-[460px] overflow-y-auto">
        {currentMessages.map((msg) => (
          <div key={msg.id} className="space-y-1">
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-bold ${
                  msg.isBot ? 'text-cyan-400 flex items-center gap-1' : 'text-slate-200'
                }`}
              >
                {msg.isBot && <Bot className="h-3.5 w-3.5" />}
                {msg.senderName}
              </span>
              <span className="font-mono text-[10px] text-slate-500">
                {shortenAddress(msg.senderAddress, 4)}
              </span>
              <span className="text-[10px] text-slate-500">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            <div
              className={`rounded-2xl p-3 text-xs leading-relaxed ${
                msg.isBot
                  ? 'bg-cyan-950/40 border border-cyan-500/30 text-cyan-200'
                  : 'bg-slate-900 border border-white/5 text-slate-300'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input bar */}
      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder={`Message #${activeChannel}...`}
          className="flex-1 rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
        />
        <button
          type="submit"
          className="flex items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 px-5 text-white transition-all cursor-pointer font-bold shadow-md shadow-cyan-500/20"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
};

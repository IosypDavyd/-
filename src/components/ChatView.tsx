import React, { useState, useRef } from 'react';
import {
  MessageSquare,
  Send,
  Shield,
  Bot,
  Sparkles,
  Users,
  Mic,
  Square,
  Play,
  Pause,
  Image as ImageIcon,
  Paperclip,
  Flag,
  Ban,
  CheckCircle2,
  AlertTriangle,
  X,
  TrendingUp,
  Cpu,
  Coins,
  DollarSign,
  ShieldAlert,
  ShieldCheck,
  Volume2,
  ExternalLink,
  Globe,
  RefreshCw,
  Loader2,
} from 'lucide-react';
import { WalletAccount, LanguageCode, TokenAsset } from '../types/wallet';
import { shortenAddress } from '../utils/crypto';
import {
  filterHarmfulContent,
  isUserBlocked,
  createModerationReport,
  filterVisibleMessages,
  ModerationReport,
} from '../utils/moderationUtils';
import { AvatarArtwork } from './AvatarArtwork';
import { AvatarBackground } from './AvatarBackground';

interface ChatMessage {
  id: string;
  senderName: string;
  senderAddress: string;
  text: string;
  timestamp: number;
  isBot?: boolean;
  isAgent?: boolean;
  avatarTheme?: any;
  audioDurationSec?: number;
  imageUrl?: string;
  imageCaption?: string;
  sources?: { title: string; url: string }[];
  model?: string;
}

interface ChatViewProps {
  account: WalletAccount;
  language?: LanguageCode;
  tokens?: TokenAsset[];
}

export const ChatView: React.FC<ChatViewProps> = ({
  account,
  language = 'uk',
  tokens = [],
}) => {
  // Navigation mode: 'ai-agent' (Crypto/Stocks/Blockchains/Wallets Expert) vs 'community' (P2P Moderated Messenger)
  const [activeMode, setActiveMode] = useState<'ai-agent' | 'community'>('ai-agent');
  const [communityChannel, setCommunityChannel] = useState<'alpha' | 'holders' | 'moderation'>('alpha');

  // Blocked users state (persisted in localStorage)
  const [blockedAddresses, setBlockedAddresses] = useState<string[]>(() => {
    const saved = localStorage.getItem('mysteryum_blocked_users');
    return saved ? JSON.parse(saved) : [];
  });

  // Moderation reports state
  const [reports, setReports] = useState<ModerationReport[]>(() => {
    const saved = localStorage.getItem('mysteryum_chat_reports');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'rep-init-1',
            messageId: 'spam-mock-1',
            reportedSenderName: 'FakeAirdrop_Bot',
            reportedSenderAddress: 'ScamDrainer1111111111111111111111111111111',
            reportedMessageText: 'Claim 50 SOL bonus at phishing-site.xyz',
            reporterAddress: account.address,
            reason: 'phishing',
            details: 'Attempted drainer link',
            timestamp: Date.now() - 3600000,
            status: 'resolved',
          },
        ];
  });

  // Reporting modal state
  const [reportingMessage, setReportingMessage] = useState<ChatMessage | null>(null);
  const [reportReason, setReportReason] = useState<'phishing' | 'spam' | 'security_violation' | 'offensive'>('phishing');
  const [reportSuccessBanner, setReportSuccessBanner] = useState<string | null>(null);

  // Audio voice recording simulation & real mic state
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const recordingTimerRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  // Gemini model selection & Google Search Grounding toggle
  const [aiModel, setAiModel] = useState<'gemini-3.8-flash' | 'gemini-3.1-flash-lite'>('gemini-3.8-flash');
  const [useSearchGrounding, setUseSearchGrounding] = useState<boolean>(true);

  // Image attachment state
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // AI Agent Chat messages
  const [aiMessages, setAiMessages] = useState<ChatMessage[]>([
    {
      id: 'ai-1',
      senderName: 'ECOSYSTEM AI Professional Advisor',
      senderAddress: 'AI-EXPERT-AGENT-SOLANA',
      text:
        language === 'uk'
          ? 'Вітаю! Я ваш професійний AI-консультант у сфері криптовалют, архітектури Solana, безпеки некастодіальних гаманців, криптобірж (CEX/DEX) та токенізованих акцій (xStocks). Чим я можу допомогти вам сьогодні?'
          : 'Greetings! I am your professional AI Advisor specializing in cryptocurrency, Solana blockchain architecture, non-custodial wallet security, CEX/DEX exchanges, and tokenized US equities (xStocks). How may I assist your portfolio today?',
      timestamp: Date.now() - 1000 * 60 * 5,
      isAgent: true,
      avatarTheme: 'cyber-king',
    },
  ]);

  // Community Messages
  const [communityMessages, setCommunityMessages] = useState<Record<string, ChatMessage[]>>({
    alpha: [
      {
        id: 'msg-1',
        senderName: 'SolanaWhale_99',
        senderAddress: '8xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
        text: 'Solana DEX volume on Jupiter reached $2.4B in 24 hours. Fast transaction confirmation and sub-penny gas make it unbeatable.',
        timestamp: Date.now() - 1000 * 60 * 25,
        avatarTheme: 'golden-midas',
      },
      {
        id: 'msg-2',
        senderName: 'CryptoAnalyst_Pro',
        senderAddress: '5mNxP98YF21dJ3G7Hk19aRt67QvBnM8pU3sD4kLKPGM',
        text: 'Ось скріншот графіку ліквідності KPGM та прибутку по пулах JitoSOL (+7.82% APY):',
        imageUrl: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=600&auto=format&fit=crop&q=80',
        imageCaption: 'Solana DeFi Liquidity Analytics',
        timestamp: Date.now() - 1000 * 60 * 15,
        avatarTheme: 'neon-grail',
      },
      {
        id: 'msg-3',
        senderName: 'VaultGuardian_UA',
        senderAddress: '3zVp9M1aW7e4R2KPGM5mNxP98YF21dJ3G7Hk19aRt67',
        text: 'Голосове повідомлення про оновлення 25¢ NFT-аватарів та синхронізацію з віртуальними картками:',
        audioDurationSec: 14,
        timestamp: Date.now() - 1000 * 60 * 8,
        avatarTheme: 'shield-guardian',
      },
    ],
    holders: [
      {
        id: 'msg-4',
        senderName: 'CyberNomad',
        senderAddress: '4hZp9M1aW7e4R2KPGM5mNxP98YF21dJ3G7Hk19aRt67',
        text: 'Тільки що замінував Solana Neon King за 25 центів (0.00136 SOL). Аватарка одразу зʼявилася на моїй віртуальній картці!',
        timestamp: Date.now() - 1000 * 60 * 40,
        avatarTheme: 'neon-grail',
      },
      {
        id: 'msg-5',
        senderName: 'SecurityChief_Sol',
        senderAddress: '9pRt67QvBnM8pU3sD4kLKPGM5mNxP98YF21dJ3G7Hk1',
        text: 'Нагадування спільноті: ніколи не передавайте 12 слів вашої секретної сід-фрази нікому в приватні повідомлення!',
        timestamp: Date.now() - 1000 * 60 * 5,
        avatarTheme: 'protocol-guardian',
      },
    ],
  });

  const [inputMessage, setInputMessage] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);

  // Filter messages for current channel against blocked users
  const currentCommunityMessages = filterVisibleMessages(
    communityMessages[communityChannel] || [],
    blockedAddresses
  );

  // Quick prompt buttons for AI Agent
  const aiQuickPrompts = [
    {
      title: 'Solana & SOL Прогноз',
      query: 'Зроби детальний аналіз Solana: консенсус PoH, TPS, цінові рівні SOL та прогноз розвитку.',
    },
    {
      title: 'Безпека гаманця & Сід-фраза',
      query: 'Як захистити мій гаманець від dreiner-сайтів, фішингу і як правильно зберігати 12 слів?',
    },
    {
      title: 'CEX проти DEX',
      query: 'Порівняй криптобіржі: CEX (Binance, Bybit, OKX) проти Solana DEX (Jupiter, Raydium). Де безпечніше?',
    },
    {
      title: 'xStocks (Акції США)',
      query: 'Поясни, як працюють токенізовані акції xStocks (NVDA, TSLA, AAPL, SPY) на блокчейні Solana.',
    },
    {
      title: 'Стейкінг та MEV',
      query: 'Яка дохідність стейкінгу в JitoSOL та Marinade? Що таке MEV нагороди на Solana?',
    },
  ];

  // Real Microphone Audio Recording with MediaRecorder & Gemini Transcribe
  const handleStartVoiceRecording = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Microphone not supported on this browser');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start();
      setIsRecordingVoice(true);
      setRecordingSeconds(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.warn('Microphone access unavailable, using simulated voice recording:', err);
      // Fallback timer simulation
      setIsRecordingVoice(true);
      setRecordingSeconds(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    }
  };

  const handleStopVoiceRecording = async (send: boolean) => {
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    const duration = recordingSeconds || 5;
    setIsRecordingVoice(false);
    setRecordingSeconds(0);

    const mediaRecorder = mediaRecorderRef.current;
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach((track) => track.stop());
    }

    if (send && duration > 0) {
      if (activeMode === 'community') {
        const audioMsg: ChatMessage = {
          id: `voice-${Date.now()}`,
          senderName: 'You (' + shortenAddress(account.address, 4) + ')',
          senderAddress: account.address,
          text: language === 'uk' ? 'Голосове повідомлення' : 'Voice Message',
          audioDurationSec: duration,
          timestamp: Date.now(),
          avatarTheme: account.avatarTheme || 'cyber-king',
        };
        setCommunityMessages((prev) => ({
          ...prev,
          [communityChannel]: [...(prev[communityChannel] || []), audioMsg],
        }));
      } else {
        // Transcribe audio using gemini-3.5-transcribe if audio blob exists
        if (audioChunksRef.current.length > 0) {
          setIsTranscribing(true);
          try {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
            const reader = new FileReader();
            reader.readAsDataURL(audioBlob);
            reader.onloadend = async () => {
              const base64Audio = reader.result as string;
              try {
                const res = await fetch('/api/ai/transcribe', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ audioBase64: base64Audio, mimeType: 'audio/webm' }),
                });

                if (res.ok) {
                  const data = await res.json();
                  if (data.transcription && data.transcription.trim()) {
                    handleSendAiMessage(data.transcription);
                    return;
                  }
                }
              } catch (e) {
                console.warn('Transcription request error, falling back:', e);
              }
              handleSendAiMessage(`[Голосове аудіоповідомлення тривалістю ${duration} сек]: Як оптимізувати Solana портфель?`);
            };
          } catch (e) {
            handleSendAiMessage(`[Голосове аудіоповідомлення тривалістю ${duration} сек]: Як оптимізувати Solana портфель?`);
          } finally {
            setIsTranscribing(false);
          }
        } else {
          handleSendAiMessage(`[Голосове аудіоповідомлення тривалістю ${duration} сек]: Як оптимізувати Solana портфель?`);
        }
      }
    }
  };

  // Image file handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setAttachedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Block user handler
  const handleBlockUser = (address: string, name: string) => {
    if (!blockedAddresses.includes(address)) {
      const updated = [...blockedAddresses, address];
      setBlockedAddresses(updated);
      localStorage.setItem('mysteryum_blocked_users', JSON.stringify(updated));
      setReportSuccessBanner(`Користувача ${name} (${shortenAddress(address, 4)}) заблоковано. Його повідомлення приховані.`);
      setTimeout(() => setReportSuccessBanner(null), 4000);
    }
  };

  const handleUnblockUser = (address: string) => {
    const updated = blockedAddresses.filter((a) => a !== address);
    setBlockedAddresses(updated);
    localStorage.setItem('mysteryum_blocked_users', JSON.stringify(updated));
    setReportSuccessBanner(`Користувача ${shortenAddress(address, 4)} розблоковано.`);
    setTimeout(() => setReportSuccessBanner(null), 3000);
  };

  // Report message submit
  const handleConfirmReport = () => {
    if (!reportingMessage) return;

    const newReport = createModerationReport({
      messageId: reportingMessage.id,
      reportedSenderName: reportingMessage.senderName,
      reportedSenderAddress: reportingMessage.senderAddress,
      reportedMessageText: reportingMessage.text,
      reporterAddress: account.address,
      reason: reportReason,
    });

    const updated = [newReport, ...reports];
    setReports(updated);
    localStorage.setItem('mysteryum_chat_reports', JSON.stringify(updated));

    // Also auto block if phishing
    if (reportReason === 'phishing' && !blockedAddresses.includes(reportingMessage.senderAddress)) {
      handleBlockUser(reportingMessage.senderAddress, reportingMessage.senderName);
    }

    setReportingMessage(null);
    setReportSuccessBanner('Скаргу успішно надіслано модераторам Ecosystem. Дякуємо за дотримання безпеки спільноти!');
    setTimeout(() => setReportSuccessBanner(null), 5000);
  };

  // Send message in AI Mode (Real Gemini Multi-turn Chat with Google Search Grounding)
  const handleSendAiMessage = async (queryText: string) => {
    const textToSend = queryText || inputMessage;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      senderName: 'You (' + shortenAddress(account.address, 4) + ')',
      senderAddress: account.address,
      text: textToSend,
      timestamp: Date.now(),
      avatarTheme: account.avatarTheme || 'cyber-king',
    };

    const newAiMessages = [...aiMessages, userMsg];
    setAiMessages(newAiMessages);
    setInputMessage('');
    setIsAiThinking(true);

    try {
      // Format previous turns for Gemini multi-turn conversation
      const history = newAiMessages.slice(0, -1).map((m) => ({
        role: m.isAgent ? 'model' : 'user',
        text: m.text,
      }));

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history,
          model: aiModel,
          useSearch: useSearchGrounding,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      const agentReply: ChatMessage = {
        id: `ai-rep-${Date.now()}`,
        senderName: 'ECOSYSTEM AI Professional Advisor',
        senderAddress: 'AI-EXPERT-AGENT-SOLANA',
        text: data.reply,
        timestamp: Date.now(),
        isAgent: true,
        avatarTheme: 'cyber-king',
        sources: data.sources || [],
        model: data.model || aiModel,
      };
      setAiMessages((prev) => [...prev, agentReply]);
    } catch (err: any) {
      console.warn('Gemini server call failed, using high-fidelity local advisor fallback:', err);
      // Fallback domain response
      let fallbackText = '';
      const q = textToSend.toLowerCase();

      if (q.includes('прогноз') || q.includes('sol') || q.includes('solana') || q.includes('цін')) {
        fallbackText =
          'Аналіз Solana (SOL): Мережа демонструє рекордну пропускну здатність із стабільними 3,500+ TPS та субсекундним часом підтвердження блоку (~400 мс). Завдяки технологіям Proof of History (PoH) та Sealevel паралелізму, SOL має суттєву фундаментальну перевагу над мережами з високим газом. Рекомендація: 70% у ліквідний стейкінг JitoSOL/Marinade та 30% у ліквідні пули на Jupiter.';
      } else if (q.includes('безпек') || q.includes('сід') || q.includes('seed') || q.includes('ключ')) {
        fallbackText =
          'Керівництво з безпеки Ecosystem Vault:\n1. 12 слів вашої секретної фрази генеруються тільки на цьому пристрої за стандартом BIP-39 / Ed25519.\n2. Ніхто крім вас не має доступу. Ніколи не вводьте сід-фразу в сторонніх чатах чи сайтах.\n3. Увімкніть біометричний захист та PIN у налаштуваннях гаманця.';
      } else if (q.includes('cex') || q.includes('dex') || q.includes('бірж')) {
        fallbackText =
          'CEX vs DEX на Solana:\n• CEX (Binance, Bybit): Зручні для введення фіату, але діє правило "Not your keys, not your coins".\n• DEX (Jupiter, Raydium): 100% некастодіальна торгівля прямо з гаманця з автоматичним вибором найкращої ціни без посередників.';
      } else {
        fallbackText =
          `Аналізую ваш запит щодо "${textToSend}". У мережі Solana середня вартість транзакції становить ~0.000005 SOL (< $0.001). Ваші активи у Ecosystem Vault повністю захищені некастодіальним шифруванням.`;
      }

      const agentReply: ChatMessage = {
        id: `ai-rep-${Date.now()}`,
        senderName: 'ECOSYSTEM AI Professional Advisor',
        senderAddress: 'AI-EXPERT-AGENT-SOLANA',
        text: fallbackText,
        timestamp: Date.now(),
        isAgent: true,
        avatarTheme: 'cyber-king',
        model: 'gemini-3.8-flash (offline backup)',
      };
      setAiMessages((prev) => [...prev, agentReply]);
    } finally {
      setIsAiThinking(false);
    }
  };

  // Send message in Community Mode
  const handleSendCommunityMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() && !attachedImage) return;

    // Check for harmful content
    const check = filterHarmfulContent(inputMessage);
    if (check.isHarmful) {
      setReportSuccessBanner(`Попередження системи модерації: Повідомлення містить потенційно шкідливий вміст (${check.reason}). Його заблоковано.`);
      setInputMessage('');
      setAttachedImage(null);
      setTimeout(() => setReportSuccessBanner(null), 5000);
      return;
    }

    const userMsg: ChatMessage = {
      id: `com-${Date.now()}`,
      senderName: 'You (' + shortenAddress(account.address, 4) + ')',
      senderAddress: account.address,
      text: inputMessage,
      imageUrl: attachedImage || undefined,
      timestamp: Date.now(),
      avatarTheme: account.avatarTheme || 'cyber-king',
    };

    setCommunityMessages((prev) => ({
      ...prev,
      [communityChannel]: [...(prev[communityChannel] || []), userMsg],
    }));

    setInputMessage('');
    setAttachedImage(null);

    // Auto peer response
    setTimeout(() => {
      const peerReplies = [
        'Підтверджую транзакцію у Solana Explorer, комісія 0.000005 SOL!',
        'Завдяки аватарці Ecosystem отримав знижку на комісію свопу на Jupiter.',
        'Відмінний результат! Не забудьте перевірити оновлення цін у вкладці Портфель.',
      ];
      const randomReply = peerReplies[Math.floor(Math.random() * peerReplies.length)];

      const peerMsg: ChatMessage = {
        id: `peer-${Date.now()}`,
        senderName: 'SolanaValidator_Alpha',
        senderAddress: 'Val11111111111111111111111111111111111111111',
        text: randomReply,
        timestamp: Date.now(),
        avatarTheme: 'golden-midas',
      };

      setCommunityMessages((prev) => ({
        ...prev,
        [communityChannel]: [...(prev[communityChannel] || []), peerMsg],
      }));
    }, 1200);
  };

  return (
    <div className="relative mx-auto max-w-3xl space-y-4 pb-28 text-slate-100">
      {/* Ambient Avatar Background Watermark */}
      <AvatarBackground
        theme={account.avatarTheme || 'cyber-king'}
        opacity={0.06}
        position="top-right"
      />

      {/* Mode Switcher Tabs */}
      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-3 rounded-3xl border border-white/10 bg-[#0c101a]/95 backdrop-blur-xl p-3 shadow-2xl">
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <button
            onClick={() => setActiveMode('ai-agent')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold transition-all cursor-pointer ${
              activeMode === 'ai-agent'
                ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-lg shadow-cyan-500/25'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Bot className="h-4 w-4 text-cyan-300" />
            <span>ШІ Агент Професіонал</span>
            <span className="rounded-full bg-cyan-950/80 px-1.5 py-0.2 text-[9px] font-mono text-cyan-300 border border-cyan-500/30">
              AI 24/7
            </span>
          </button>

          <button
            onClick={() => setActiveMode('community')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold transition-all cursor-pointer ${
              activeMode === 'community'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-purple-500/25'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Users className="h-4 w-4 text-purple-300" />
            <span>P2P Спільнота & Чат</span>
          </button>
        </div>

        {/* Sub-Channel / Moderation Bar */}
        {activeMode === 'community' && (
          <div className="flex items-center gap-1 w-full sm:w-auto justify-end">
            <button
              onClick={() => setCommunityChannel('alpha')}
              className={`rounded-xl px-2.5 py-1 text-xs font-mono transition-all ${
                communityChannel === 'alpha'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              #alpha-chat
            </button>
            <button
              onClick={() => setCommunityChannel('holders')}
              className={`rounded-xl px-2.5 py-1 text-xs font-mono transition-all ${
                communityChannel === 'holders'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              #nft-holders
            </button>
            <button
              onClick={() => setCommunityChannel('moderation')}
              className={`flex items-center gap-1 rounded-xl px-2.5 py-1 text-xs font-mono transition-all ${
                communityChannel === 'moderation'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldAlert className="h-3.5 w-3.5" />
              <span>Модерація ({reports.length})</span>
            </button>
          </div>
        )}
      </div>

      {/* Notification Banner */}
      {reportSuccessBanner && (
        <div className="relative z-10 flex items-center justify-between gap-2 rounded-2xl border border-cyan-500/40 bg-cyan-950/80 p-3 text-xs text-cyan-200 shadow-lg animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0" />
            <span>{reportSuccessBanner}</span>
          </div>
          <button onClick={() => setReportSuccessBanner(null)} className="text-slate-400 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Main Mode 1: AI Crypto & Stocks Professional Agent */}
      {activeMode === 'ai-agent' && (
        <div className="relative z-10 space-y-4">
          {/* Model Selector & Google Search Grounding Control */}
          <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400 font-mono">Модель:</span>
              <div className="inline-flex rounded-xl bg-slate-900/90 p-0.5 border border-white/10">
                <button
                  type="button"
                  onClick={() => setAiModel('gemini-3.8-flash')}
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-mono font-bold transition-all ${
                    aiModel === 'gemini-3.8-flash'
                      ? 'bg-cyan-500 text-black shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  gemini-3.8-flash
                </button>
                <button
                  type="button"
                  onClick={() => setAiModel('gemini-3.1-flash-lite')}
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-mono font-bold transition-all ${
                    aiModel === 'gemini-3.1-flash-lite'
                      ? 'bg-cyan-500 text-black shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  flash-lite (fast)
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setUseSearchGrounding(!useSearchGrounding)}
              className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1 border text-[11px] font-mono transition-all cursor-pointer ${
                useSearchGrounding
                  ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                  : 'bg-slate-900/60 border-white/10 text-slate-400 hover:text-slate-200'
              }`}
              title="Google Search Grounding via Gemini 3.8 Flash"
            >
              <Globe className="h-3.5 w-3.5 text-emerald-400" />
              <span>Google Search {useSearchGrounding ? 'ON' : 'OFF'}</span>
            </button>
          </div>

          {/* Quick Prompts Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {aiQuickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSendAiMessage(p.query)}
                className="shrink-0 flex items-center gap-1.5 rounded-xl border border-white/10 bg-slate-900/80 hover:border-cyan-500/40 hover:bg-slate-800 px-3 py-1.5 text-xs text-slate-300 transition-all cursor-pointer"
              >
                <Sparkles className="h-3 w-3 text-cyan-400" />
                <span>{p.title}</span>
              </button>
            ))}
          </div>

          {/* Messages Container */}
          <div className="min-h-[420px] max-h-[560px] overflow-y-auto space-y-3 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md p-4 sm:p-5 shadow-2xl">
            {aiMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.isAgent ? 'justify-start' : 'justify-end'}`}
              >
                {msg.isAgent && (
                  <div className="h-9 w-9 rounded-xl overflow-hidden border border-cyan-400/50 bg-black shrink-0 shadow">
                    <AvatarArtwork theme={msg.avatarTheme || 'cyber-king'} size="100%" showCrownGlow={false} />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 shadow-md ${
                    msg.isAgent
                      ? 'border border-cyan-500/30 bg-gradient-to-br from-[#0e172a] to-[#0a1120] text-slate-200'
                      : 'border border-indigo-500/30 bg-indigo-950/60 text-white'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5 text-[11px] font-mono text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <span className={msg.isAgent ? 'text-cyan-300 font-bold' : 'text-indigo-300'}>
                        {msg.senderName}
                      </span>
                      {msg.model && (
                        <span className="rounded bg-black/50 border border-white/10 px-1.5 py-0.2 text-[9px] text-cyan-300">
                          {msg.model}
                        </span>
                      )}
                    </div>
                    <span>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm whitespace-pre-line leading-relaxed">
                    {msg.text}
                  </p>

                  {/* Grounded Google Search Sources */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-3 border-t border-white/10 pt-2 space-y-1">
                      <div className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 flex items-center gap-1">
                        <Globe className="h-3 w-3" />
                        <span>Джерела Google Search:</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.sources.map((src, i) => (
                          <a
                            key={i}
                            href={src.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 rounded-lg bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 text-[10px] text-emerald-300 hover:text-white transition-colors"
                          >
                            <span className="truncate max-w-[180px]">{src.title || src.url}</span>
                            <ExternalLink className="h-2.5 w-2.5 shrink-0" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {!msg.isAgent && (
                  <div className="h-9 w-9 rounded-xl overflow-hidden border border-indigo-400/50 bg-black shrink-0 shadow">
                    <AvatarArtwork theme={account.avatarTheme || 'cyber-king'} size="100%" showCrownGlow={false} />
                  </div>
                )}
              </div>
            ))}

            {isAiThinking && (
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 p-2">
                <Bot className="h-4 w-4 animate-spin text-cyan-400" />
                <span>AI ({aiModel}) аналізує блокчейн та дані...</span>
              </div>
            )}

            {isTranscribing && (
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 p-2">
                <Loader2 className="h-4 w-4 animate-spin text-emerald-400" />
                <span>gemini-3.5-transcribe розпізнає ваш голос...</span>
              </div>
            )}
          </div>

          {/* AI Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendAiMessage(inputMessage);
            }}
            className="flex items-center gap-2 rounded-2xl border border-white/10 bg-[#0f1422]/90 p-2 shadow-xl"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Запитайте AI про крипту, біржі CEX/DEX, акції xStocks або безпеку..."
              className="flex-1 bg-transparent px-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none"
            />

            {/* Voice record button */}
            {isRecordingVoice ? (
              <button
                type="button"
                onClick={() => handleStopVoiceRecording(true)}
                className="flex items-center gap-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 px-3 py-2 text-xs font-bold text-white transition-all animate-pulse cursor-pointer"
              >
                <Square className="h-3.5 w-3.5 fill-current" />
                <span>{recordingSeconds}s · Надіслати</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleStartVoiceRecording}
                className="rounded-xl border border-white/10 bg-slate-900/80 hover:bg-slate-800 p-2 text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
                title="Записати голос (gemini-3.5-transcribe)"
              >
                <Mic className="h-4 w-4" />
              </button>
            )}

            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="flex items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-4 py-2 text-xs font-bold text-white hover:opacity-90 transition-all disabled:opacity-40 cursor-pointer"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}

      {/* Main Mode 2: P2P Community Moderated Messenger */}
      {activeMode === 'community' && communityChannel !== 'moderation' && (
        <div className="relative z-10 space-y-4">
          {/* Moderation & Safety Status Pill */}
          <div className="flex items-center justify-between rounded-2xl border border-emerald-500/20 bg-emerald-950/20 px-4 py-2 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Модерація активна: Захист від спаму, фішингу та викрадення сід-фраз.</span>
            </div>
            {blockedAddresses.length > 0 && (
              <span className="font-mono text-[10px] text-rose-300">
                Заблоковано користувачів: {blockedAddresses.length}
              </span>
            )}
          </div>

          {/* Messages Container */}
          <div className="min-h-[420px] max-h-[560px] overflow-y-auto space-y-3 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md p-4 sm:p-5 shadow-2xl">
            {currentCommunityMessages.map((msg) => {
              const isMe = msg.senderAddress === account.address;
              const isPlaying = playingAudioId === msg.id;

              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 group ${isMe ? 'justify-end' : 'justify-start'}`}
                >
                  {!isMe && (
                    <div className="h-9 w-9 rounded-xl overflow-hidden border border-white/10 bg-black shrink-0 shadow">
                      <AvatarArtwork theme={msg.avatarTheme || 'cyber-king'} size="100%" showCrownGlow={false} />
                    </div>
                  )}

                  <div
                    className={`relative max-w-[85%] sm:max-w-[78%] rounded-2xl p-3.5 shadow-md ${
                      isMe
                        ? 'border border-cyan-500/30 bg-gradient-to-br from-cyan-950/50 to-indigo-950/50 text-white'
                        : 'border border-white/10 bg-slate-900/80 text-slate-200'
                    }`}
                  >
                    {/* Header: Sender & Timestamp */}
                    <div className="flex items-center justify-between gap-2 mb-1.5 text-[11px] font-mono text-slate-400">
                      <span className={isMe ? 'text-cyan-300 font-bold' : 'text-slate-300 font-semibold'}>
                        {msg.senderName}
                      </span>
                      <span>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    {/* Text Body */}
                    {msg.text && (
                      <p className="text-xs sm:text-sm whitespace-pre-line leading-relaxed mb-2">
                        {msg.text}
                      </p>
                    )}

                    {/* Image Attachment (if any) */}
                    {msg.imageUrl && (
                      <div className="my-2 overflow-hidden rounded-xl border border-white/10 bg-black max-w-sm">
                        <img
                          src={msg.imageUrl}
                          alt={msg.imageCaption || 'Uploaded image'}
                          onClick={() => setExpandedImage(msg.imageUrl || null)}
                          className="h-44 w-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                        />
                        {msg.imageCaption && (
                          <div className="p-2 text-[10px] font-mono text-slate-400 bg-slate-950/80">
                            {msg.imageCaption}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Audio Voice Note Player (if voice message) */}
                    {msg.audioDurationSec && (
                      <div className="flex items-center gap-3 rounded-xl border border-cyan-500/30 bg-cyan-950/40 p-2.5 my-1.5">
                        <button
                          type="button"
                          onClick={() => setPlayingAudioId(isPlaying ? null : msg.id)}
                          className="h-8 w-8 rounded-full bg-cyan-400 text-black flex items-center justify-center hover:bg-cyan-300 transition-colors shadow"
                        >
                          {isPlaying ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current ml-0.5" />}
                        </button>

                        <div className="flex-1 space-y-1">
                          {/* Animated Waveform Bars */}
                          <div className="flex items-center gap-0.5 h-5">
                            {[16, 24, 12, 32, 20, 28, 14, 22, 18, 30, 26, 12, 20, 16, 24].map((h, i) => (
                              <div
                                key={i}
                                className={`w-1 rounded-full transition-all ${
                                  isPlaying
                                    ? 'bg-cyan-400 animate-pulse'
                                    : 'bg-slate-600'
                                }`}
                                style={{ height: `${h}px` }}
                              />
                            ))}
                          </div>
                          <div className="flex justify-between text-[10px] font-mono text-cyan-300">
                            <span>{isPlaying ? 'Відтворення...' : 'Голосове аудіо'}</span>
                            <span>0:{msg.audioDurationSec < 10 ? `0${msg.audioDurationSec}` : msg.audioDurationSec}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Quick Action Bar for Peer messages: Block & Report */}
                    {!isMe && (
                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setReportingMessage(msg)}
                          className="flex items-center gap-1 text-[10px] text-amber-400 hover:text-amber-300 font-mono transition-colors"
                          title="Поскаржитися на це повідомлення"
                        >
                          <Flag className="h-3 w-3" />
                          <span>Поскаржитися</span>
                        </button>

                        <span className="text-slate-600">·</span>

                        <button
                          onClick={() => handleBlockUser(msg.senderAddress, msg.senderName)}
                          className="flex items-center gap-1 text-[10px] text-rose-400 hover:text-rose-300 font-mono transition-colors"
                          title="Заблокувати користувача"
                        >
                          <Ban className="h-3 w-3" />
                          <span>Заблокувати</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {isMe && (
                    <div className="h-9 w-9 rounded-xl overflow-hidden border border-cyan-400/50 bg-black shrink-0 shadow">
                      <AvatarArtwork theme={account.avatarTheme || 'cyber-king'} size="100%" showCrownGlow={false} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Attached Image Preview before send */}
          {attachedImage && (
            <div className="relative inline-block rounded-2xl border border-cyan-500/40 bg-black p-1 shadow-lg">
              <img src={attachedImage} alt="Attachment" className="h-20 w-28 rounded-xl object-cover" />
              <button
                type="button"
                onClick={() => setAttachedImage(null)}
                className="absolute -top-2 -right-2 rounded-full bg-rose-500 text-white p-1 hover:bg-rose-600 shadow"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}

          {/* Input Box for Community Mode */}
          <form
            onSubmit={handleSendCommunityMessage}
            className="flex items-center gap-2 rounded-2xl border border-white/10 bg-[#0f1422]/90 p-2 shadow-xl"
          >
            {/* File input for images */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-xl border border-white/10 bg-slate-900/80 hover:bg-slate-800 p-2 text-slate-400 hover:text-cyan-400 transition-colors"
              title="Прикріпити фото / скріншот"
            >
              <ImageIcon className="h-4 w-4" />
            </button>

            {/* Voice Recording Control */}
            {isRecordingVoice ? (
              <div className="flex-1 flex items-center justify-between rounded-xl bg-rose-950/50 border border-rose-500/40 px-3 py-1.5 animate-pulse">
                <div className="flex items-center gap-2 text-rose-300 text-xs font-mono">
                  <div className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
                  <span>Запис голосу: {recordingSeconds}s</span>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleStopVoiceRecording(false)}
                    className="text-slate-400 hover:text-white text-xs font-bold"
                  >
                    Скасувати
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStopVoiceRecording(true)}
                    className="rounded-lg bg-rose-500 px-2.5 py-1 text-xs font-bold text-white hover:bg-rose-600"
                  >
                    Надіслати
                  </button>
                </div>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleStartVoiceRecording}
                  className="rounded-xl border border-white/10 bg-slate-900/80 hover:bg-slate-800 p-2 text-slate-400 hover:text-cyan-400 transition-colors"
                  title="Записати голосове повідомлення"
                >
                  <Mic className="h-4 w-4" />
                </button>

                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Напишіть повідомлення в захищений чат Ecosystem..."
                  className="flex-1 bg-transparent px-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none"
                />

                <button
                  type="submit"
                  disabled={!inputMessage.trim() && !attachedImage}
                  className="flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2 text-xs font-bold text-white hover:opacity-90 transition-all disabled:opacity-40"
                >
                  <Send className="h-4 w-4" />
                </button>
              </>
            )}
          </form>
        </div>
      )}

      {/* Mode 2 Subchannel: Moderation Desk & Blocked Users View */}
      {activeMode === 'community' && communityChannel === 'moderation' && (
        <div className="relative z-10 space-y-6">
          <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-950/30 via-slate-900/60 to-black/60 p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold text-white">
                  Панель модерації та безпеки контенту
                </h3>
                <p className="text-xs text-slate-400">
                  Відповідність вимогам Google Play та Apple App Store (User-Generated Content Policy)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="rounded-2xl border border-white/5 bg-black/40 p-3 space-y-1">
                <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">Фільтрація</span>
                <p className="text-xs font-bold text-white">Авто-блокування фішингу</p>
                <p className="text-[10px] text-slate-400">Захист сід-фраз та підозрілих URL</p>
              </div>

              <div className="rounded-2xl border border-white/5 bg-black/40 p-3 space-y-1">
                <span className="text-[10px] font-mono text-rose-400 uppercase font-bold">Блокування</span>
                <p className="text-xs font-bold text-white">{blockedAddresses.length} заблоковано</p>
                <p className="text-[10px] text-slate-400">Повідомлення негайно приховуються</p>
              </div>

              <div className="rounded-2xl border border-white/5 bg-black/40 p-3 space-y-1">
                <span className="text-[10px] font-mono text-amber-400 uppercase font-bold">Скарги</span>
                <p className="text-xs font-bold text-white">{reports.length} звітів</p>
                <p className="text-[10px] text-slate-400">Перевірка модераторами</p>
              </div>
            </div>
          </div>

          {/* Blocked Users List */}
          <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 space-y-4">
            <h4 className="font-heading text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Ban className="h-4 w-4 text-rose-400" />
              <span>Список заблокованих користувачів ({blockedAddresses.length})</span>
            </h4>

            {blockedAddresses.length === 0 ? (
              <p className="text-xs text-slate-400 py-2">
                Немає заблокованих користувачів. Ви можете заблокувати будь-якого спамера, натиснувши "Заблокувати" біля його повідомлення.
              </p>
            ) : (
              <div className="space-y-2">
                {blockedAddresses.map((addr) => (
                  <div
                    key={addr}
                    className="flex items-center justify-between p-3 rounded-2xl border border-white/5 bg-black/40"
                  >
                    <div>
                      <p className="text-xs font-mono font-bold text-white">{shortenAddress(addr, 8)}</p>
                      <p className="text-[10px] text-rose-400 font-mono">Контент заблоковано</p>
                    </div>
                    <button
                      onClick={() => handleUnblockUser(addr)}
                      className="rounded-xl border border-cyan-500/30 bg-cyan-950/60 hover:bg-cyan-900 px-3 py-1.5 text-xs font-bold text-cyan-300 transition-colors"
                    >
                      Розблокувати
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Moderation Reports List */}
          <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 space-y-4">
            <h4 className="font-heading text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Flag className="h-4 w-4 text-amber-400" />
              <span>Останні надіслані скарги ({reports.length})</span>
            </h4>

            <div className="space-y-2">
              {reports.map((rep) => (
                <div
                  key={rep.id}
                  className="p-3.5 rounded-2xl border border-white/5 bg-black/40 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 text-[10px] font-mono font-bold uppercase">
                      {rep.reason}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(rep.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-white font-semibold">
                    На користувача: {rep.reportedSenderName} ({shortenAddress(rep.reportedSenderAddress, 6)})
                  </p>
                  <p className="text-xs text-slate-400 italic bg-slate-950 p-2 rounded-xl border border-white/5">
                    "{rep.reportedMessageText}"
                  </p>
                  <div className="flex items-center gap-2 pt-1 text-[10px] font-mono text-emerald-400">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Статус: {rep.status === 'resolved' ? 'Вирішено / Заблоковано' : 'На розгляді'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {reportingMessage && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in"
        >
          <div className="relative w-full max-w-md rounded-3xl border border-amber-500/40 bg-[#0e1422] p-6 shadow-2xl space-y-5">
            <button
              onClick={() => setReportingMessage(null)}
              className="absolute right-4 top-4 rounded-xl p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Flag className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold text-white">
                  Поскаржитися на контент
                </h3>
                <p className="text-xs text-slate-400">
                  Оберіть причину порушення правил безпеки
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-3 space-y-1">
              <p className="text-xs font-bold text-white">
                Автор: {reportingMessage.senderName} ({shortenAddress(reportingMessage.senderAddress, 6)})
              </p>
              <p className="text-xs text-slate-300 italic">
                "{reportingMessage.text}"
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Причина скарги:
              </label>
              {[
                { id: 'phishing', label: 'Спроба фішингу або крадіжки сід-фрази' },
                { id: 'spam', label: 'Спам або реклама сторонніх проєктів' },
                { id: 'security_violation', label: 'Порушення правил безпеки гаманця' },
                { id: 'offensive', label: 'Образливий або неприйнятний вміст' },
              ].map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setReportReason(r.id as any)}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left text-xs transition-all ${
                    reportReason === r.id
                      ? 'border-amber-500/60 bg-amber-950/40 text-amber-200'
                      : 'border-white/5 bg-slate-900/60 text-slate-300 hover:bg-slate-900'
                  }`}
                >
                  <span>{r.label}</span>
                  {reportReason === r.id && <CheckCircle2 className="h-4 w-4 text-amber-400" />}
                </button>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setReportingMessage(null)}
                className="flex-1 rounded-xl border border-white/10 bg-slate-800 py-3 text-xs font-bold text-slate-300 hover:bg-slate-700"
              >
                Скасувати
              </button>
              <button
                type="button"
                onClick={handleConfirmReport}
                className="flex-1 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 py-3 text-xs font-extrabold text-black hover:opacity-90 transition-opacity"
              >
                Надіслати скаргу
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Expanded Image Modal */}
      {expandedImage && (
        <div
          role="dialog"
          onClick={() => setExpandedImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in cursor-pointer"
        >
          <div className="relative max-w-3xl max-h-[85vh] overflow-hidden rounded-3xl border border-white/20">
            <img src={expandedImage} alt="Expanded view" className="w-full h-full object-contain" />
            <button
              onClick={() => setExpandedImage(null)}
              className="absolute top-4 right-4 rounded-full bg-black/70 p-2 text-white hover:bg-black"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNav, ActiveTab } from './components/BottomNav';
import { PortfolioView } from './components/PortfolioView';
import { SwapView } from './components/SwapView';
import { AiAgentView } from './components/AiAgentView';
import { ChatView } from './components/ChatView';
import { ExploreView } from './components/ExploreView';
import { SettingsView } from './components/SettingsView';
import { SupportPortalView } from './components/SupportPortalView';

import { SendModal } from './components/modals/SendModal';
import { ReceiveModal } from './components/modals/ReceiveModal';
import { BuyModal } from './components/modals/BuyModal';
import { StakeModal } from './components/modals/StakeModal';
import { PerpTradeModal } from './components/modals/PerpTradeModal';
import { AccountModal } from './components/modals/AccountModal';
import { BiometricUnlockModal } from './components/modals/BiometricUnlockModal';
import { PriceAlertsModal } from './components/modals/PriceAlertsModal';
import { AvatarGalleryView } from './components/AvatarGalleryView';
import { EcosystemPortalView } from './components/EcosystemPortalView';
import { WelcomeVideoModal } from './components/modals/WelcomeVideoModal';

import {
  WalletAccount,
  NetworkId,
  LanguageCode,
  TokenAsset,
  PerpPosition,
  TransactionRecord,
  PriceAlert,
  TriggeredPriceAlert,
  AvatarNFTItem,
  AvatarTheme,
  MysteryumCard,
} from './types/wallet';
import {
  INITIAL_TOKENS,
  XSTOCKS_DATA,
  PERP_MARKETS,
  STAKING_OPTIONS,
  INITIAL_NFTS,
  MYSTERYUM_CARDS,
  INITIAL_AVATAR_NFTS,
  INITIAL_TRANSACTIONS,
} from './data/mockData';
import {
  generateSeedPhrase,
  deriveSolanaAddressFromSeed,
} from './utils/crypto';
import { evaluatePriceAlerts } from './utils/priceAlerts';
import { assignAvatarToCard } from './utils/avatarUtils';

const DEFAULT_PRICE_ALERTS: PriceAlert[] = [
  {
    id: 'alert-sol-5',
    tokenSymbol: 'SOL',
    basePriceUsd: 184.2,
    targetDeviationPercent: 5.0,
    direction: 'any',
    enabled: true,
    createdAt: Date.now() - 3600000,
  },
  {
    id: 'alert-bonk-10',
    tokenSymbol: 'BONK',
    basePriceUsd: 0.0000224,
    targetDeviationPercent: 10.0,
    direction: 'up',
    enabled: true,
    createdAt: Date.now() - 7200000,
  },
  {
    id: 'alert-jup-7',
    tokenSymbol: 'JUP',
    basePriceUsd: 0.98,
    targetDeviationPercent: 7.0,
    direction: 'down',
    enabled: true,
    createdAt: Date.now() - 10800000,
  },
];

export default function App() {
  // Check URL pathname or query for support
  const initialTab =
    window.location.pathname.includes('/support') || window.location.hash.includes('support')
      ? 'support'
      : 'portfolio';

  const [activeTab, setActiveTab] = useState<ActiveTab>(initialTab);
  const [network, setNetwork] = useState<NetworkId>('mainnet-beta');
  const [currency, setCurrency] = useState<string>('USD');
  const [language, setLanguage] = useState<LanguageCode>('en');

  // Accounts state
  const [accounts, setAccounts] = useState<WalletAccount[]>(() => {
    const saved = localStorage.getItem('mysteryum_accounts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    const defaultPhrase = [
      'quantum', 'cyber', 'grail', 'mystery', 'solana', 'vault',
      'shadow', 'plasma', 'future', 'energy', 'matrix', 'shield'
    ];
    const defaultAddr = deriveSolanaAddressFromSeed(defaultPhrase);
    return [
      {
        id: 'acc-1',
        name: 'Mysteryum Vault #01',
        address: defaultAddr,
        seedPhrase: defaultPhrase,
        privateKeyHex: '8c92f1b40d3a5e7819c62d0e4f3a8b7156c9a2e3d4f8b01247a3e5c9b1d6f284',
        createdAt: Date.now(),
      },
    ];
  });

  const [activeAccountId, setActiveAccountId] = useState<string>(() => accounts[0].id);

  // Core application state
  const [tokens, setTokens] = useState<TokenAsset[]>(() => {
    const saved = localStorage.getItem('mysteryum_tokens');
    return saved ? JSON.parse(saved) : INITIAL_TOKENS;
  });

  const [perpPositions, setPerpPositions] = useState<PerpPosition[]>(() => {
    const saved = localStorage.getItem('mysteryum_perps');
    return saved ? JSON.parse(saved) : [];
  });

  const [stakingOptions, setStakingOptions] = useState(() => {
    const saved = localStorage.getItem('mysteryum_staking');
    return saved ? JSON.parse(saved) : STAKING_OPTIONS;
  });

  const [transactions, setTransactions] = useState<TransactionRecord[]>(() => {
    const saved = localStorage.getItem('mysteryum_txs');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  // Mysteryum 8 Virtual Cards state
  const [cards, setCards] = useState<MysteryumCard[]>(() => {
    const saved = localStorage.getItem('mysteryum_cards');
    return saved ? JSON.parse(saved) : MYSTERYUM_CARDS;
  });

  // Official 25¢ NFT Avatars state
  const [avatars, setAvatars] = useState<AvatarNFTItem[]>(() => {
    const saved = localStorage.getItem('mysteryum_avatar_nfts');
    return saved ? JSON.parse(saved) : INITIAL_AVATAR_NFTS;
  });

  // Modal controls
  const [isSendOpen, setIsSendOpen] = useState(false);
  const [sendDefaultSymbol, setSendDefaultSymbol] = useState('SOL');

  const [isReceiveOpen, setIsReceiveOpen] = useState(false);
  const [isBuyOpen, setIsBuyOpen] = useState(false);

  const [isStakeOpen, setIsStakeOpen] = useState(false);
  const [stakeDefaultProvider, setStakeDefaultProvider] = useState('jito');

  const [isPerpOpen, setIsPerpOpen] = useState(false);
  const [perpDefaultSymbol, setPerpDefaultSymbol] = useState('SOL-PERP');

  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [swapDefaultFrom, setSwapDefaultFrom] = useState('SOL');
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Real-time Price Alerts state
  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>(() => {
    const saved = localStorage.getItem('mysteryum_price_alerts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return DEFAULT_PRICE_ALERTS;
  });
  const [triggeredAlerts, setTriggeredAlerts] = useState<TriggeredPriceAlert[]>([]);
  const [isPriceAlertsModalOpen, setIsPriceAlertsModalOpen] = useState<boolean>(false);
  const [isLiveTickerEnabled, setIsLiveTickerEnabled] = useState<boolean>(true);

  // Biometric security states
  const [isLocked, setIsLocked] = useState<boolean>(() => {
    return localStorage.getItem('mysteryum_locked') === 'true';
  });
  const [isBiometricModalOpen, setIsBiometricModalOpen] = useState<boolean>(false);

  const handleUnlock = () => {
    setIsLocked(false);
    setIsBiometricModalOpen(false);
    localStorage.setItem('mysteryum_locked', 'false');
  };

  const handleLock = () => {
    setIsLocked(true);
    setIsBiometricModalOpen(true);
    localStorage.setItem('mysteryum_locked', 'true');
  };

  // Persistence effects
  useEffect(() => {
    localStorage.setItem('mysteryum_accounts', JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem('mysteryum_tokens', JSON.stringify(tokens));
  }, [tokens]);

  useEffect(() => {
    localStorage.setItem('mysteryum_perps', JSON.stringify(perpPositions));
  }, [perpPositions]);

  useEffect(() => {
    localStorage.setItem('mysteryum_staking', JSON.stringify(stakingOptions));
  }, [stakingOptions]);

  useEffect(() => {
    localStorage.setItem('mysteryum_txs', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('mysteryum_cards', JSON.stringify(cards));
  }, [cards]);

  useEffect(() => {
    localStorage.setItem('mysteryum_avatar_nfts', JSON.stringify(avatars));
  }, [avatars]);

  useEffect(() => {
    localStorage.setItem('mysteryum_price_alerts', JSON.stringify(priceAlerts));
  }, [priceAlerts]);

  // Live Simulated Market Volatility Engine
  useEffect(() => {
    if (!isLiveTickerEnabled) return;

    const interval = setInterval(() => {
      // Pick a volatile token at random
      const volatileSymbols = ['SOL', 'BONK', 'JUP', 'RAY', 'KPGM'];
      const randomSymbol = volatileSymbols[Math.floor(Math.random() * volatileSymbols.length)];
      // Random tick between -1.5% and +1.5%
      const deltaPercent = Number(((Math.random() - 0.48) * 2.4).toFixed(2));

      setTokens((prev) => {
        let currentNewPrice = 0;
        const nextTokens = prev.map((t) => {
          if (t.symbol === randomSymbol) {
            const factor = 1 + deltaPercent / 100;
            currentNewPrice = Number((t.usdPrice * factor).toFixed(t.usdPrice < 0.01 ? 7 : 2));
            return {
              ...t,
              usdPrice: Math.max(0.000001, currentNewPrice),
              change24h: Number((t.change24h + deltaPercent).toFixed(2)),
            };
          }
          return t;
        });

        if (currentNewPrice > 0) {
          const activeMatches = evaluatePriceAlerts(priceAlerts, { [randomSymbol]: currentNewPrice });
          if (activeMatches.length > 0) {
            setTriggeredAlerts((prior) => {
              const fresh = activeMatches.filter((m) => !prior.some((p) => p.alertId === m.alertId));
              return fresh.length > 0 ? [...fresh, ...prior] : prior;
            });
          }
        }
        return nextTokens;
      });
    }, 7000);

    return () => clearInterval(interval);
  }, [isLiveTickerEnabled, priceAlerts]);

  const activeAccount = accounts.find((a) => a.id === activeAccountId) || accounts[0];
  const solToken = tokens.find((t) => t.symbol === 'SOL') || tokens[0];
  const usdcToken = tokens.find((t) => t.symbol === 'USDC') || tokens[2];

  // Price alert handlers
  const handleAddAlert = (alertData: Omit<PriceAlert, 'id' | 'createdAt'>) => {
    const newAlert: PriceAlert = {
      ...alertData,
      id: `alert-${Date.now()}`,
      createdAt: Date.now(),
    };
    setPriceAlerts((prev) => [newAlert, ...prev]);
  };

  const handleToggleAlert = (alertId: string) => {
    setPriceAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, enabled: !a.enabled } : a))
    );
  };

  const handleDeleteAlert = (alertId: string) => {
    setPriceAlerts((prev) => prev.filter((a) => a.id !== alertId));
    setTriggeredAlerts((prev) => prev.filter((a) => a.alertId !== alertId));
  };

  const handleDismissTriggeredAlert = (alertId: string) => {
    setTriggeredAlerts((prev) => prev.filter((a) => a.id !== alertId));
  };

  const handleSimulatePriceShock = (symbol: string, percentChange: number) => {
    const targetToken = tokens.find((t) => t.symbol === symbol);
    if (!targetToken) return;

    const factor = 1 + percentChange / 100;
    const updatedPrice = Number(
      Math.max(0.000001, targetToken.usdPrice * factor).toFixed(targetToken.usdPrice < 0.01 ? 7 : 2)
    );

    setTokens((prev) =>
      prev.map((t) => {
        if (t.symbol === symbol) {
          return {
            ...t,
            usdPrice: updatedPrice,
            change24h: Number((t.change24h + percentChange).toFixed(2)),
          };
        }
        return t;
      })
    );

    const newlyTriggered = evaluatePriceAlerts(priceAlerts, { [symbol]: updatedPrice });
    if (newlyTriggered.length > 0) {
      setTriggeredAlerts((prev) => [
        ...newlyTriggered,
        ...prev.filter((p) => p.tokenSymbol !== symbol),
      ]);
    }
  };

  // Action handlers
  const handleSend = (symbol: string, recipient: string, amount: number) => {
    setTokens((prev) =>
      prev.map((t) => (t.symbol === symbol ? { ...t, balance: Math.max(0, t.balance - amount) } : t))
    );

    const token = tokens.find((t) => t.symbol === symbol);
    const newTx: TransactionRecord = {
      id: `tx-${Date.now()}`,
      type: 'send',
      symbol,
      amount,
      amountUsd: amount * (token?.usdPrice || 1),
      fromAddress: activeAccount.address,
      toAddress: recipient,
      timestamp: Date.now(),
      status: 'confirmed',
      signature: '5wKzq9R1xYv4NpM8Lt62AqBsDtFvGeKnHzQjXp7R3wEa',
      feeSol: 0.000005,
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  const handleExecuteSwap = (fromSymbol: string, toSymbol: string, inAmount: number, outAmount: number) => {
    setTokens((prev) =>
      prev.map((t) => {
        if (t.symbol === fromSymbol) return { ...t, balance: Math.max(0, t.balance - inAmount) };
        if (t.symbol === toSymbol) return { ...t, balance: t.balance + outAmount };
        return t;
      })
    );

    const fromToken = tokens.find((t) => t.symbol === fromSymbol);
    const newTx: TransactionRecord = {
      id: `tx-${Date.now()}`,
      type: 'swap',
      symbol: `${fromSymbol} → ${toSymbol}`,
      amount: inAmount,
      amountUsd: inAmount * (fromToken?.usdPrice || 1),
      fromAddress: activeAccount.address,
      toAddress: 'JupiterDEXRouter11111111111111111111111111111',
      timestamp: Date.now(),
      status: 'confirmed',
      signature: '7hJq2NpM8Lt62AqBsDtFvGeKnHzQjXp7R3wEa5wKzq9R1',
      feeSol: 0.000005,
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  const handleBuyTopUp = (solAmount: number) => {
    setTokens((prev) =>
      prev.map((t) => (t.symbol === 'SOL' ? { ...t, balance: t.balance + solAmount } : t))
    );

    const newTx: TransactionRecord = {
      id: `tx-${Date.now()}`,
      type: 'receive',
      symbol: 'SOL (On-ramp Topup)',
      amount: solAmount,
      amountUsd: solAmount * solToken.usdPrice,
      fromAddress: 'MoonPaySolanaTreasury1111111111111111111111',
      toAddress: activeAccount.address,
      timestamp: Date.now(),
      status: 'confirmed',
      signature: '9qP31c4h6yT99u1iA5dF3sW7e4R2KPGM5mNxP98YF21d',
      feeSol: 0.000005,
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  const handleStake = (providerId: string, amount: number) => {
    setTokens((prev) =>
      prev.map((t) => (t.symbol === 'SOL' ? { ...t, balance: Math.max(0, t.balance - amount) } : t))
    );

    setStakingOptions((prev: any[]) =>
      prev.map((opt) => (opt.id === providerId ? { ...opt, stakedAmount: opt.stakedAmount + amount } : opt))
    );

    const newTx: TransactionRecord = {
      id: `tx-${Date.now()}`,
      type: 'stake',
      symbol: `${amount} SOL Staked`,
      amount,
      amountUsd: amount * solToken.usdPrice,
      fromAddress: activeAccount.address,
      toAddress: `${providerId.toUpperCase()}StakePool11111111111111111111111`,
      timestamp: Date.now(),
      status: 'confirmed',
      signature: '3hBm7K9pQ1xYv4NpM8Lt62AqBsDtFvGeKnHzQjXp7R3w',
      feeSol: 0.000005,
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  const handleUpdateAutoStake = (providerId: string, enabled: boolean, thresholdSol: number) => {
    setStakingOptions((prev: any[]) =>
      prev.map((opt) =>
        opt.id === providerId
          ? { ...opt, autoStakeEnabled: enabled, autoStakeThreshold: thresholdSol }
          : opt
      )
    );
  };

  const handleCompoundAccrued = (providerId: string) => {
    const opt = stakingOptions.find((o: any) => o.id === providerId);
    if (!opt || !opt.accruedRewardsSol || opt.accruedRewardsSol <= 0) return;

    const accruedAmount = opt.accruedRewardsSol;
    setStakingOptions((prev: any[]) =>
      prev.map((o: any) =>
        o.id === providerId
          ? {
              ...o,
              stakedAmount: Number((o.stakedAmount + accruedAmount).toFixed(4)),
              accruedRewardsSol: 0,
              totalCompoundCount: (o.totalCompoundCount || 0) + 1,
            }
          : o
      )
    );

    const newTx: TransactionRecord = {
      id: `tx-${Date.now()}`,
      type: 'stake',
      symbol: `Auto-Stake: ${accruedAmount.toFixed(4)} SOL Compounded`,
      amount: accruedAmount,
      amountUsd: accruedAmount * solToken.usdPrice,
      fromAddress: `${providerId.toUpperCase()}RewardsVault`,
      toAddress: `${providerId.toUpperCase()}StakePool11111111111111111111111`,
      timestamp: Date.now(),
      status: 'confirmed',
      signature: '5kReStake4CompoundingRewards111111111111111111111',
      feeSol: 0.000005,
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  const handleOpenPerpPosition = (posData: Omit<PerpPosition, 'id' | 'timestamp'>) => {
    setTokens((prev) =>
      prev.map((t) => (t.symbol === 'USDC' ? { ...t, balance: Math.max(0, t.balance - posData.collateralUsd) } : t))
    );

    const newPosition: PerpPosition = {
      ...posData,
      id: `pos-${Date.now()}`,
      timestamp: Date.now(),
    };
    setPerpPositions((prev) => [newPosition, ...prev]);
  };

  const handleClosePosition = (posId: string) => {
    const pos = perpPositions.find((p) => p.id === posId);
    if (!pos) return;

    const returnAmount = Math.max(0, pos.collateralUsd + pos.pnlUsd);
    setTokens((prev) =>
      prev.map((t) => (t.symbol === 'USDC' ? { ...t, balance: t.balance + returnAmount } : t))
    );

    setPerpPositions((prev) => prev.filter((p) => p.id !== posId));
  };

  const handleMintAvatar = (avatarId: string, paymentMethod: 'usdc' | 'sol' | 'kpgm' | 'card') => {
    const avatar = avatars.find((a) => a.id === avatarId);
    if (!avatar) return;

    // Deduct 25 cents payment method
    if (paymentMethod === 'usdc') {
      setTokens((prev) =>
        prev.map((t) => (t.symbol === 'USDC' ? { ...t, balance: Math.max(0, t.balance - 0.25) } : t))
      );
    } else if (paymentMethod === 'sol') {
      setTokens((prev) =>
        prev.map((t) => (t.symbol === 'SOL' ? { ...t, balance: Math.max(0, t.balance - 0.00135) } : t))
      );
    } else if (paymentMethod === 'kpgm') {
      setTokens((prev) =>
        prev.map((t) => (t.symbol === 'KPGM' ? { ...t, balance: Math.max(0, t.balance - 25) } : t))
      );
    }

    const txSig = '5' + Math.random().toString(36).substring(2, 10) + 'SolMint25c' + Date.now().toString(36);

    // Update avatar state
    setAvatars((prev) =>
      prev.map((av) =>
        av.id === avatarId
          ? {
              ...av,
              isMinted: true,
              mintedAt: Date.now(),
              txSignature: txSig,
            }
          : av
      )
    );

    // Record confirmed mint transaction
    const newTx: TransactionRecord = {
      id: `tx-${Date.now()}`,
      type: 'mint',
      symbol: `NFT: ${avatar.name} (25¢)`,
      amount: 0.25,
      amountUsd: 0.25,
      fromAddress: activeAccount.address,
      toAddress: avatar.mintAddress,
      timestamp: Date.now(),
      status: 'confirmed',
      signature: txSig,
      feeSol: 0.000005,
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  const handleEquipAvatar = (theme: AvatarTheme) => {
    setAccounts((prev) =>
      prev.map((acc) => (acc.id === activeAccountId ? { ...acc, avatarTheme: theme } : acc))
    );
    setAvatars((prev) =>
      prev.map((av) => ({ ...av, isEquipped: av.theme === theme }))
    );
  };

  const handleAssignToCard = (avatarId: string, cardId: number) => {
    const avatar = avatars.find((a) => a.id === avatarId);
    if (!avatar) return;
    setCards((prev) => assignAvatarToCard(prev, cardId, avatar));
  };

  const handleCreateNewAccount = () => {
    const phrase = generateSeedPhrase();
    const address = deriveSolanaAddressFromSeed(phrase);
    const newAcc: WalletAccount = {
      id: `acc-${Date.now()}`,
      name: `Mysteryum Vault #${accounts.length + 1}`,
      address,
      seedPhrase: phrase,
      privateKeyHex: 'a' + Date.now().toString(16) + 'f8b01247a3e5c9b1d6f2848c92f1b40d3a5e7819c62d0e4',
      createdAt: Date.now(),
    };
    setAccounts((prev) => [...prev, newAcc]);
    setActiveAccountId(newAcc.id);
  };

  const handleRestoreFromPhrase = (words: string[]) => {
    const address = deriveSolanaAddressFromSeed(words);
    const restoredAcc: WalletAccount = {
      id: `acc-${Date.now()}`,
      name: `Restored Vault #${accounts.length + 1}`,
      address,
      seedPhrase: words,
      privateKeyHex: 'd3a5e7819c62d0e4f3a8b7156c9a2e3d4f8b01247a3e5c9b1d6f2848c92f1b40',
      createdAt: Date.now(),
    };
    setAccounts((prev) => [...prev, restoredAcc]);
    setActiveAccountId(restoredAcc.id);
  };

  const handleResetWallet = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#080a0f] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Header */}
      <Header
        account={activeAccount}
        network={network}
        onNetworkChange={setNetwork}
        currency={currency}
        onCurrencyChange={setCurrency}
        language={language}
        onLanguageChange={setLanguage}
        onOpenSupport={() => setActiveTab('support')}
        onOpenReceive={() => setIsReceiveOpen(true)}
        onOpenAccountModal={() => setIsAccountModalOpen(true)}
        onOpenGallery={() => setActiveTab('gallery')}
        onOpenVideo={() => setIsVideoModalOpen(true)}
        totalBalanceUsd={tokens.reduce((acc, t) => acc + t.balance * t.usdPrice, 0)}
        isLocked={isLocked}
        onToggleLock={() => (isLocked ? setIsBiometricModalOpen(true) : handleLock())}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-5">
        {activeTab === 'portfolio' && (
          <PortfolioView
            tokens={tokens}
            xStocks={XSTOCKS_DATA}
            perpMarkets={PERP_MARKETS}
            perpPositions={perpPositions}
            stakingOptions={stakingOptions}
            nfts={INITIAL_NFTS}
            cards={cards}
            avatars={avatars}
            transactions={transactions}
            currency={currency}
            language={language}
            isLocked={isLocked}
            onTriggerUnlock={() => setIsBiometricModalOpen(true)}
            priceAlerts={priceAlerts}
            triggeredAlerts={triggeredAlerts}
            onOpenPriceAlertsModal={() => setIsPriceAlertsModalOpen(true)}
            onOpenGallery={() => setActiveTab('gallery')}
            onDismissTriggeredAlert={handleDismissTriggeredAlert}
            onSimulatePriceShock={handleSimulatePriceShock}
            onOpenSend={(sym) => {
              if (sym) setSendDefaultSymbol(sym);
              setIsSendOpen(true);
            }}
            onOpenReceive={() => setIsReceiveOpen(true)}
            onOpenBuy={() => setIsBuyOpen(true)}
            onOpenSwap={(sym) => {
              if (sym) setSwapDefaultFrom(sym);
              setActiveTab('swap');
            }}
            onOpenStake={(pId) => {
              if (pId) setStakeDefaultProvider(pId);
              setIsStakeOpen(true);
            }}
            onOpenPerp={(sym) => {
              if (sym) setPerpDefaultSymbol(sym);
              setIsPerpOpen(true);
            }}
            onClosePosition={handleClosePosition}
          />
        )}

        {/* 25¢ NFT Avatar Mint & Customization Gallery */}
        {activeTab === 'gallery' && (
          <AvatarGalleryView
            avatars={avatars}
            cards={cards}
            account={activeAccount}
            currency={currency}
            language={language}
            onMintAvatar={handleMintAvatar}
            onEquipAvatar={handleEquipAvatar}
            onAssignToCard={handleAssignToCard}
          />
        )}

        {activeTab === 'swap' && (
          <SwapView
            tokens={tokens}
            onExecuteSwap={handleExecuteSwap}
            defaultFrom={swapDefaultFrom}
            avatarTheme={activeAccount.avatarTheme}
            onOpenGallery={() => setActiveTab('gallery')}
          />
        )}

        {activeTab === 'chat' && (
          <ChatView
            account={activeAccount}
            language={language}
            tokens={tokens}
          />
        )}

        {activeTab === 'explore' && <ExploreView onOpenGallery={() => setActiveTab('gallery')} />}

        {activeTab === 'portal' && (
          <EcosystemPortalView
            onOpenGallery={() => setActiveTab('gallery')}
            onOpenSwap={() => setActiveTab('swap')}
            onOpenExplore={() => setActiveTab('explore')}
            language={language}
            activeAvatarTheme={activeAccount.avatarTheme}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            account={activeAccount}
            network={network}
            onNetworkChange={setNetwork}
            currency={currency}
            onCurrencyChange={setCurrency}
            language={language}
            onLanguageChange={setLanguage}
            onResetWallet={handleResetWallet}
            onOpenSupport={() => setActiveTab('support')}
            onOpenGallery={() => setActiveTab('gallery')}
            onTriggerLock={handleLock}
          />
        )}

        {activeTab === 'support' && (
          <SupportPortalView
            language={language}
            onLanguageChange={setLanguage}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        language={language}
      />

      {/* Modals */}
      {isSendOpen && (
        <SendModal
          tokens={tokens}
          currency={currency}
          onClose={() => setIsSendOpen(false)}
          onSend={handleSend}
          defaultTokenSymbol={sendDefaultSymbol}
        />
      )}

      {isReceiveOpen && (
        <ReceiveModal
          account={activeAccount}
          network={network}
          onClose={() => setIsReceiveOpen(false)}
        />
      )}

      {isBuyOpen && (
        <BuyModal
          currency={currency}
          solPriceUsd={solToken.usdPrice}
          onClose={() => setIsBuyOpen(false)}
          onSimulateTopUp={handleBuyTopUp}
        />
      )}

      {isStakeOpen && (
        <StakeModal
          stakingOptions={stakingOptions}
          solBalance={solToken.balance}
          onClose={() => setIsStakeOpen(false)}
          onStake={handleStake}
          onUpdateAutoStake={handleUpdateAutoStake}
          onCompoundAccrued={handleCompoundAccrued}
          defaultProviderId={stakeDefaultProvider}
        />
      )}

      {isPerpOpen && (
        <PerpTradeModal
          markets={PERP_MARKETS}
          usdcBalance={usdcToken.balance}
          onClose={() => setIsPerpOpen(false)}
          onOpenPosition={handleOpenPerpPosition}
          defaultSymbol={perpDefaultSymbol}
        />
      )}

      {isAccountModalOpen && (
        <AccountModal
          accounts={accounts}
          activeAccount={activeAccount}
          onSelectAccount={(acc) => setActiveAccountId(acc.id)}
          onCreateNewAccount={handleCreateNewAccount}
          onRestoreFromPhrase={handleRestoreFromPhrase}
          onOpenGallery={() => setActiveTab('gallery')}
          onClose={() => setIsAccountModalOpen(false)}
        />
      )}

      {/* Simulated Biometric Unlock Screen Modal */}
      <BiometricUnlockModal
        isOpen={isBiometricModalOpen}
        walletAddress={activeAccount.address}
        accountName={activeAccount.name}
        onUnlock={handleUnlock}
        onClose={() => setIsBiometricModalOpen(false)}
        canDismiss={!isLocked}
      />

      {/* Real-Time Price Alerts Modal */}
      <PriceAlertsModal
        isOpen={isPriceAlertsModalOpen}
        onClose={() => setIsPriceAlertsModalOpen(false)}
        alerts={priceAlerts}
        tokens={tokens}
        onAddAlert={handleAddAlert}
        onToggleAlert={handleToggleAlert}
        onDeleteAlert={handleDeleteAlert}
        onSimulatePriceShock={handleSimulatePriceShock}
        isLiveTickerEnabled={isLiveTickerEnabled}
        onToggleLiveTicker={() => setIsLiveTickerEnabled((prev) => !prev)}
      />

      {/* Official Greeting Promo Video Modal */}
      <WelcomeVideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        language={language}
        onExploreFeatures={(tab) => {
          setActiveTab(tab);
          setIsVideoModalOpen(false);
        }}
      />
    </div>
  );
}

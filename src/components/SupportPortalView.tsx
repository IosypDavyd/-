import React, { useState } from 'react';
import {
  LifeBuoy,
  FileText,
  Copy,
  Check,
  HelpCircle,
  ExternalLink,
  Shield,
  Apple,
  Download,
  Terminal,
  Key,
} from 'lucide-react';
import { LanguageCode } from '../types/wallet';
import { SUPPORTED_LANGUAGES, TRANSLATIONS } from '../utils/i18n';
import { STORE_SUBMISSION_MD, PRIVACY_POLICY_TEXT } from '../data/supportContent';

interface SupportPortalViewProps {
  language: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
}

export const SupportPortalView: React.FC<SupportPortalViewProps> = ({
  language,
  onLanguageChange,
}) => {
  const [copiedMd, setCopiedMd] = useState(false);
  const [copiedKeytool, setCopiedKeytool] = useState(false);
  const [copiedGithubCommands, setCopiedGithubCommands] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);

  const t = TRANSLATIONS[language];

  const keytoolCommand =
    'keytool -genkey -v -keystore mysteryum-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias mysteryum-key';

  const handleCopyMd = () => {
    navigator.clipboard.writeText(STORE_SUBMISSION_MD);
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2000);
  };

  const handleCopyKeytool = () => {
    navigator.clipboard.writeText(keytoolCommand);
    setCopiedKeytool(true);
    setTimeout(() => setCopiedKeytool(false), 2000);
  };

  return (
    <article className="mx-auto max-w-3xl space-y-8 pb-28 text-slate-200">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-950 border border-cyan-500/40 text-cyan-400">
            <LifeBuoy className="h-6 w-6" />
          </div>
          <div>
            <span className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-widest">
              Official Guide
            </span>
            <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-white">
              {t.supportTitle}
            </h1>
          </div>
        </div>

        <p className="mt-3 text-sm text-slate-400 leading-relaxed">
          {t.supportSubtitle}
        </p>

        {/* 16 Language Selector Pills */}
        <div className="mt-4 flex flex-wrap gap-1.5" aria-label="Support languages">
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = language === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => onLanguageChange(lang.code)}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all cursor-pointer ${
                  isSelected
                    ? 'border border-cyan-500 bg-cyan-500 text-white font-bold shadow-md shadow-cyan-500/25'
                    : 'border border-white/10 bg-slate-900/80 text-slate-400 hover:text-white hover:border-white/20'
                }`}
              >
                {lang.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Quick Bar */}
      <div className="flex flex-wrap gap-2 pt-2">
        <button
          onClick={() => setShowSubmissionModal(true)}
          className="flex items-center gap-1.5 rounded-xl border border-cyan-500/40 bg-cyan-950/40 px-3.5 py-2 text-xs font-bold text-cyan-300 hover:bg-cyan-900/60 transition-colors shadow-sm cursor-pointer"
        >
          <FileText className="h-4 w-4" />
          <span>View STORE_SUBMISSION.md</span>
        </button>

        <button
          onClick={() => setShowPrivacyModal(true)}
          className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-slate-900 px-3.5 py-2 text-xs font-bold text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <Shield className="h-4 w-4 text-emerald-400" />
          <span>Privacy Policy</span>
        </button>
      </div>

      {/* GitHub Repository Setup for IosypDavyd */}
      <section className="rounded-2xl border border-cyan-500/40 bg-gradient-to-r from-cyan-950/40 via-slate-900 to-indigo-950/40 p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Terminal className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-bold text-white">
                GitHub Repository: IosypDavyd
              </h2>
              <p className="text-xs text-slate-400">
                Create & push this codebase to{' '}
                <a
                  href="https://github.com/IosypDavyd"
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-400 underline font-mono"
                >
                  github.com/IosypDavyd
                </a>
              </p>
            </div>
          </div>

          <a
            href="https://github.com/new?name=mysteryum-wallet-solana"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 px-3.5 py-2 text-xs font-bold text-white transition-all shadow-md shadow-cyan-500/20 cursor-pointer"
          >
            <span>Create Repo on GitHub</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>

        <div className="space-y-2 rounded-xl border border-white/5 bg-slate-900/80 p-3.5 text-xs">
          <div className="flex items-center justify-between text-slate-300">
            <span className="font-semibold text-white">Push to your GitHub repository:</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(
                  'git remote add origin https://github.com/IosypDavyd/mysteryum-wallet-solana.git\ngit branch -M main\ngit push -u origin main'
                );
                setCopiedGithubCommands(true);
                setTimeout(() => setCopiedGithubCommands(false), 2000);
              }}
              className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
            >
              {copiedGithubCommands ? (
                <>
                  <Check className="h-3 w-3 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span>Copy Commands</span>
                </>
              )}
            </button>
          </div>
          <pre className="rounded-lg bg-black/60 p-3 font-mono text-xs text-cyan-300 select-all overflow-x-auto leading-relaxed">
git remote add origin https://github.com/IosypDavyd/mysteryum-wallet-solana.git{'\n'}
git branch -M main{'\n'}
git push -u origin main
          </pre>
        </div>

        <div className="flex items-center justify-between pt-1 text-xs">
          <span className="text-slate-400">Prefer downloading the ready-to-use archive?</span>
          <a
            href="/MYSTERYUM-Wallet-Mobile.zip"
            download="MYSTERYUM-Wallet-Mobile.zip"
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 text-xs font-bold text-white transition-colors"
          >
            <Download className="h-3.5 w-3.5 text-cyan-400" />
            <span>Download MYSTERYUM-Wallet-Mobile.zip (103 KB)</span>
          </a>
        </div>
      </section>

      {/* Section 1: Preparation on Windows 11 */}
      <section className="rounded-2xl border border-white/10 bg-[#0f1420]/80 p-6 space-y-4 shadow-xl">
        <h2 className="font-heading text-xl font-bold text-white flex items-center gap-2">
          <span>1. {t.prepWindowsTitle}</span>
        </h2>

        <ol className="list-decimal space-y-3 pl-5 text-xs sm:text-sm leading-relaxed text-slate-300">
          <li>
            Download{' '}
            <a
              href="/MYSTERYUM-Wallet-Mobile.zip"
              download="MYSTERYUM-Wallet-Mobile.zip"
              className="text-cyan-400 font-bold underline inline-flex items-center gap-1"
            >
              MYSTERYUM-Wallet-Mobile.zip
              <Download className="h-3.5 w-3.5" />
            </a>{' '}
            and unpack it into a convenient folder, e.g.{' '}
            <code className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-cyan-300">
              C:\KPGM
            </code>.
          </li>
          <li>
            Install Android Studio from{' '}
            <a
              href="https://developer.android.com/studio"
              target="_blank"
              rel="noreferrer"
              className="text-cyan-400 underline inline-flex items-center gap-0.5"
            >
              developer.android.com/studio
              <ExternalLink className="h-3 w-3" />
            </a>{' '}
            — press Download and choose the “Standard” setup.
          </li>
          <li>
            Buy a Google Play developer account ($25 one-time):{' '}
            <a
              href="https://play.google.com/console"
              target="_blank"
              rel="noreferrer"
              className="text-cyan-400 underline inline-flex items-center gap-0.5"
            >
              play.google.com/console
              <ExternalLink className="h-3 w-3" />
            </a>. Publisher name:{' '}
            <strong className="text-white">ECOSYSTEM WALLET SOLANA</strong>, email:{' '}
            <a href="mailto:support@mysteryum.io" className="text-cyan-400 underline">
              support@mysteryum.io
            </a>.
          </li>
          <li>
            The Apple Developer account ($99/year) is needed later, for the App Store — you can sign up then.
          </li>
        </ol>

        {/* Keystore generator helper */}
        <div className="mt-4 rounded-xl border border-white/5 bg-slate-900/60 p-3.5 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Terminal className="h-3.5 w-3.5 text-cyan-400" />
              Windows Keytool Command Generator (Release Key)
            </span>
            <button
              onClick={handleCopyKeytool}
              className="flex items-center gap-1 text-[11px] font-mono text-cyan-400 hover:text-cyan-300 cursor-pointer"
            >
              {copiedKeytool ? (
                <>
                  <Check className="h-3 w-3 text-emerald-400" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span>Copy Command</span>
                </>
              )}
            </button>
          </div>
          <code className="block rounded-lg bg-black/50 p-2.5 font-mono text-xs text-slate-300 break-all select-all">
            {keytoolCommand}
          </code>
        </div>
      </section>

      {/* Section 2: Google Play — publishing */}
      <section className="rounded-2xl border border-white/10 bg-[#0f1420]/80 p-6 space-y-4 shadow-xl">
        <h2 className="font-heading text-xl font-bold text-white flex items-center gap-2">
          <span>2. {t.googlePlayTitle}</span>
        </h2>

        <ol className="list-decimal space-y-3 pl-5 text-xs sm:text-sm leading-relaxed text-slate-300">
          <li>
            Open the folder <code className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-cyan-300">C:\KPGM\android</code> in Android Studio (Open button) and wait 5–15 minutes while everything loads.
          </li>
          <li>
            In the top menu: <strong className="text-white">Build → Generate Signed App Bundle / APK → choose Android App Bundle (.aab)</strong>.
          </li>
          <li>
            Press <strong className="text-white">Create new…</strong> — this is your signing key. Set a file name (e.g. <code className="font-mono text-cyan-300">mysteryum-key</code>) and a password. Be sure to write the password down and keep the key file — without them you cannot ship updates!
          </li>
          <li>
            Fill in the form (name <strong className="text-white">ECOSYSTEM WALLET SOLANA</strong>) → Next → choose release → Create.
          </li>
          <li>
            The finished file is here:{' '}
            <code className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-cyan-300">
              android/app/release/app-release.aab
            </code>.
          </li>
          <li>
            In Play Console: <strong className="text-white">Create app</strong> → name <strong className="text-white">ECOSYSTEM WALLET SOLANA</strong>, language English, type App, Free.
          </li>
          <li>
            Copy the descriptions from <strong className="text-cyan-400">STORE_SUBMISSION.md</strong>, add the icon and screenshots, and enter the privacy page:{' '}
            <a
              href="https://mysteryum.io/privacy"
              target="_blank"
              rel="noreferrer"
              className="text-cyan-400 underline break-all inline-flex items-center gap-0.5"
            >
              https://mysteryum.io/privacy
              <ExternalLink className="h-3 w-3" />
            </a>.
          </li>
          <li>
            <strong className="text-white">Production → Create release → upload app-release.aab → Send for review</strong>. The review takes 1–3 days.
          </li>
        </ol>
      </section>

      {/* Section 3: App Store Connect — publishing (no Mac needed) */}
      <section className="rounded-2xl border border-white/10 bg-[#0f1420]/80 p-6 space-y-4 shadow-xl">
        <h2 className="font-heading text-xl font-bold text-white flex items-center gap-2">
          <span>3. {t.appStoreTitle}</span>
        </h2>

        <ol className="list-decimal space-y-3 pl-5 text-xs sm:text-sm leading-relaxed text-slate-300">
          <li>
            Sign up for an Apple Developer account:{' '}
            <a
              href="https://developer.apple.com/programs/enroll"
              target="_blank"
              rel="noreferrer"
              className="text-cyan-400 underline inline-flex items-center gap-0.5"
            >
              developer.apple.com/programs/enroll
              <ExternalLink className="h-3 w-3" />
            </a>{' '}
            ($99/year).
          </li>
          <li>
            Connect the project to GitHub (in Lovable, the GitHub button at the top → Connect to GitHub → Create repository) — this is needed for the cloud build.
          </li>
          <li>
            Register at Codemagic ({' '}
            <a
              href="https://codemagic.io/signup"
              target="_blank"
              rel="noreferrer"
              className="text-cyan-400 underline inline-flex items-center gap-0.5"
            >
              codemagic.io/signup
              <ExternalLink className="h-3 w-3" />
            </a>{' '}
            ) — sign in with GitHub; the free plan is enough.
          </li>
          <li>
            In Codemagic: Add application → choose the project repository → build type iOS app → connect your Apple Developer account (certificates are created automatically).
          </li>
          <li>
            Start new build — about 20 minutes. Then Publish to App Store Connect — the build lands in your account.
          </li>
          <li>
            In{' '}
            <a
              href="https://appstoreconnect.apple.com"
              target="_blank"
              rel="noreferrer"
              className="text-cyan-400 underline inline-flex items-center gap-0.5"
            >
              appstoreconnect.apple.com
              <ExternalLink className="h-3 w-3" />
            </a>: My Apps → “+” → New App: name <strong className="text-white">ECOSYSTEM WALLET SOLANA</strong>, Bundle ID{' '}
            <code className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-cyan-300">
              com.keypowergrailmystery.wallet
            </code>.
          </li>
          <li>
            Fill in the description (texts in STORE_SUBMISSION.md), privacy page{' '}
            <a
              href="https://mysteryum.io/privacy"
              target="_blank"
              rel="noreferrer"
              className="text-cyan-400 underline break-all inline-flex items-center gap-0.5"
            >
              https://mysteryum.io/privacy
              <ExternalLink className="h-3 w-3" />
            </a>{' '}
            → Submit for Review. The review takes 1–2 days.
          </li>
        </ol>
      </section>

      {/* Section 4: What reviewers may ask */}
      <section className="rounded-2xl border border-cyan-500/30 bg-cyan-950/20 p-6 space-y-3">
        <h2 className="font-heading text-lg font-bold text-white flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-cyan-400" />
          <span>{t.reviewersFaqTitle}</span>
        </h2>

        <ul className="list-disc space-y-2 pl-5 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <li>
            <strong className="text-white">Why the app needs internet access</strong> — to interact with decentralized Solana blockchain RPC networks and query real-time account balances and transactions.
          </li>
          <li>
            <strong className="text-white">Whether it offers financial services</strong> — a 100% non-custodial self-custody wallet; private keys and 12-word seed phrases are stored solely on the user's local device hardware.
          </li>
          <li>
            <strong className="text-white">Apple App Review demo video request</strong> — if requested by App Review, record a 30-second screen capture demonstrating creating a wallet and viewing the Solana portfolio.
          </li>
        </ul>
      </section>

      {/* Footer Support email */}
      <div className="pt-4 border-t border-white/10 text-center">
        <p className="text-sm text-slate-400">
          Questions and help:{' '}
          <a
            href="mailto:support@mysteryum.io"
            className="text-cyan-400 hover:text-cyan-300 underline font-medium"
          >
            support@mysteryum.io
          </a>
        </p>
      </div>

      {/* STORE_SUBMISSION.md Modal */}
      {showSubmissionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-2xl rounded-2xl border border-white/10 bg-[#0f1420] p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <h3 className="font-heading text-base font-bold text-white flex items-center gap-2">
                <FileText className="h-5 w-5 text-cyan-400" />
                <span>STORE_SUBMISSION.md</span>
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyMd}
                  className="flex items-center gap-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 px-3 py-1.5 text-xs font-bold text-white cursor-pointer"
                >
                  {copiedMd ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedMd ? 'Copied' : 'Copy All'}</span>
                </button>
                <button
                  onClick={() => setShowSubmissionModal(false)}
                  className="rounded-lg p-1 text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
            </div>

            <pre className="max-h-96 overflow-y-auto rounded-xl bg-slate-900 p-4 font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-wrap select-all">
              {STORE_SUBMISSION_MD}
            </pre>
          </div>
        </div>
      )}

      {/* Privacy Policy Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-2xl rounded-2xl border border-white/10 bg-[#0f1420] p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <h3 className="font-heading text-base font-bold text-white flex items-center gap-2">
                <Shield className="h-5 w-5 text-emerald-400" />
                <span>Privacy Policy — MYSTERYUM WALLET</span>
              </h3>
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <pre className="max-h-96 overflow-y-auto rounded-xl bg-slate-900 p-4 font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
              {PRIVACY_POLICY_TEXT}
            </pre>
          </div>
        </div>
      )}
    </article>
  );
};

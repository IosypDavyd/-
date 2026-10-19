# MYSTERYUM WALLET roadmap

## Oct 18 12:08 — Staking and wallet access
- [x] Added staking RPC fallback with independent read results; live public read returned 0.025697008 SOL, no native/liquid positions, positionsAvailable=true. Six regression tests passed, including blocked position reads retaining SOL and no automatic broadcast retry. Native simulation preserves reviewed blockhash.
- [x] Create/Open wallet stays in main operations; mobile browser verified setup and existing encrypted local wallet account settings, Jito dialog/official link, partial-outage balance 0.025697 SOL; no page errors, build OK. Publication requested below.
- [ ] Funded native staking/signing and physical-device provider connection remain unverified: no authorized funded test transaction supplied; no funds sent. Liquid staking remains explicitly external.

## Oct 18 00:13 — Token balances and AI failures
- [x] Independent token-program RPC results and uiAmountString parsing; positive balances remain visible.
- [x] Main tokens including WETH and project assets remain visible with hide-zero enabled.
- [x] Captured hidden stream failure: upstream 402 insufficient credits. Shared server-only AI helper preserves auth; Community accepts transient photos.
- [ ] Verify live photo answer — blocked by insufficient AI credits; no further AI probes.
- [ ] Test central flows and publish this update with pending carbon-logo/card changes.

## Oct 17 22:34 — Carbon logo and internal crypto cards
- [x] Install file_41907 logo and derived favicon/PWA/Android/iOS icons, preserving wallet identifiers. Native packages still need rebuilding for installed devices.
- [x] Give crypto cards distinct uploaded masks; remove bank details and Google Pay; show wallet-scoped crypto/fiat balances on home and in profile. Existing transparent background-change fee retained.
- [x] Verify cards and icons: six balance/identity tests passed; eight loaded distinct images and new encrypted local wallet cards checked on home/dialog/profile; no page errors. Buy absent from topActions; unwanted home captions absent. Publish requested below.

## Oct 17 19:00
- [x] Four payment-method selections checked on mobile; added checkmark, selected-method status and nearby continuation. Destination parameters and opening checked with intercepted provider navigation, no real payment. Seven tests passed, build OK; publication requested.

## Oct 17 18:54
- [x] VIP removed beside home balance and home cards; left-side badge on profile card verified on mobile without page errors; publication requested.

## Oct 17 18:48
- [x] Live public address showed 0.025697 SOL and €2.37; retained through three minutes of forced RPC failures. Hide/show eye verified; regression tests passed; publication requested.

## Current request — MYSTERYUM WALLET
- [x] October 17: Buy / Cash out to card tabs with six requested providers plus retained Mercuryo buy; four provider-boundary tests passed. Desktop/mobile UI, country/currency choice, official sell destinations and disabled Stripe sell checked without page errors; build OK. Provider payments and payouts not executed; no integrated payout claim.
- [x] October 17 17:10: operations entry in general header/menu and account profile; actual profile Buy/Cash out and Sell buttons checked through UI. Not published.
- [ ] Integrated Transak/Banxa/Stripe checkout and real card payout verification — blocked: approved provider onboarding/integration and an eligible funded user transaction are required; external provider information/consumer flows only are supplied in this update.
- [x] October 16 16:38: opening the site link now always lands on the full portfolio home screen (no auto-jump to setup); verified fresh desktop/mobile loads show balance and quick actions with zero horizontal overflow, and after creating a wallet «Назад» returns to the portfolio with the address in the header.
- [x] October 16 16:38: «Створити гаманець» is the first item in the quick-actions row before «Купити», opens create/restore, disappears once a wallet exists; verified same row on desktop and 390px mobile without clipping.
- [x] October 16 10:59: per-account card designs with address-scoped skin storage and previous/next switching verified using three newly created real local wallet accounts; skins stay independent after reload. Card balances remain unavailable until issuance.
- [x] October 16: virtual card design with 32 avatar skins, premium gold/chrome crowned king default, masked unavailable details, Google Pay prerequisite notice and account management entry. UA/EN and desktop/mobile checks passed without runtime errors; no card issued or payment provisioning performed, not published.
- [x] October 16: added 37 country choices, 22 payment currencies, Visa/Mastercard, Google Pay, Apple Pay and SEPA with honest Revolut/Zen/Wise limits; verified UA/EN, PLN/GBP selection, generated MoonPay links without prefilled addresses, desktop/mobile without overflow or errors. Actual MoonPay purchase not exercised; not published.
- [ ] Activate own fiat account and Visa/Mastercard issuance — blocked: licensed issuing/banking partner, business onboarding and approved country coverage are not supplied. Card acceptance and real hosted crypto purchase remain provider-dependent and unverified.
- [x] October 15 23:22: imported all ten supplied artworks (phone screenshot additionally cropped), classified 31 achievement avatars into six tiers, added 19 premium avatars in Paid plus six retained posters, owner prices and visible locked silhouettes; preserved Mystery Box. Verified 31 loaded avatar images, UA/EN folders/details, price/guest purchase view, rarity filters and mobile without overflow or runtime errors; build OK. Catalogue/condition tests and 100,000-roll odds check passed. Actual payment not exercised; art remains local, not blockchain NFT. Unsupported conditions explicitly remain unverified/locked; missing art uses existing supplied artwork, not invented new images. Not published.
- [x] October 15 22:31: updated header/stablecoin/tab labels; four-asset buy with USD/EUR/UAH and card/Google Pay preferences; seven-unit balance selector. UA/EN labels, all asset links, new local wallet, seven balance units, ETH persistence and mobile overflow verified; no page errors, build OK. Missing FX/market rates stay unavailable. Receiving address is shown for manual entry at MoonPay because prefilled addresses require signed merchant URLs. Actual external purchase/eligibility unverified; not published.
- [x] October 15 21:49: removed the "restore from file" button so only the standard secret phrase can restore a wallet; encrypted backup saving stays. Footer/captions now use «Повний контроль» (Solana · Повний контроль) and brand names carry translate="no"/class="notranslate" so browser auto-translators keep MYSTERYUM. Footer and setup buttons verified in UA/EN; build OK. Not published.
- [x] October 15: add a scannable published-wallet link QR at the bottom of Portfolio; preserve launcher icons and settings. Not published.
- [x] October 15 revised at 19:41: existing favicon and every launcher icon restored byte-identically; MYSTERYUM WALLET SOLANA label/header updated without changing wallet keys/native identifiers. file_41124 is gallery artwork only. Not published.
- [x] October 15: grouped Settings with local secure wallet controls, USD/EUR/UAH selection, contrast preference, language, FAQ/contact/share. Created test wallet using three-word verification; phrase hidden until unlock; preferences persist and mobile has no overflow. Notification permission only, no background alerts; dApp connection remains unavailable; physical biometry unverified. FX feed unavailable in test, explicitly shows missing rate.
- [x] October 15: circular xStocks rail, persistent Monitoring/Popular and contextual UNIVERSAL FINANCIAL INTELLIGENCE AI. Live AI returned structured xStocks risk analysis and disclosed no live stock quotes. Build OK; no invented stock values. Real stock trading/feed integration is not included.
- [x] October 15: uploaded posters connected to gallery; all images load, repeated shield/ecosystem artwork removed in addition to URL deduplication. Purchases not exercised in this UI task.
- [x] Scam Shield implemented: exact-mint authority/verification/liquidity warnings; SOL recipient checks and pre-review simulation; prepared swap simulation and same-transaction signing. No safety guarantee. Live funded transfer/swap verification remains blocked by public RPC availability and no funded test wallet; not claimed tested.
- [x] Voice control added with explicit browser speech-service privacy disclosure, typed fallback, deterministic SOL/USDC buy drafts, SOL send draft and balance navigation. Typed USDC-buy/balance/analysis flows and five parser checks passed; physical microphone recognition unverified. USDC sending explicitly unavailable, not silently converted to SOL.
- [x] Existing token-analysis/AI strategy retained; local risk-checked DCA plan added without unattended execution. Voice opens an analysis draft, never signs.
- [ ] Autonomous copytrading / automatic DCA execution — blocked: no verified execution provider or authorized unattended-signing design. Live trading signals are not implemented; existing AI analysis is advisory.
- [x] Added all 12 requested xStocks with downloaded official issuer logos and verified product links; Jito/Marinade live APY, native validator-specific APY left unavailable. Desktop/mobile cards, product dialog and Earn tab checked; new wallet creation/reload and staking-provider/native dialogs checked. Native signing built locally with vote validation, rent/fee review and simulation. No live funds used; not published.
- [ ] Verify wallet-specific staking reads and a funded native stake end-to-end — blocked: public Solana RPC rejects reads in test environment; shows status unavailable, not a false zero. Native unstake/withdraw management not implemented in this step; liquid stake opens official Jito/Marinade providers, not a claimed in-app connection.
- [x] Add separate stocks (xStocks, SPYX, GLDX, AAPL, TSLA) and SOL/BTC/ETH perpetual cards below crypto; Long/Short opens an explicit external-provider dialog. Desktop/mobile layouts, stock dialog, both directions and market tabs verified; no invented prices/ratios, no runtime errors, build OK. Live trading/provider integration remains separate; not published.
- [x] Styled account/address/balance as a compact premium card with supplied file_40710.jpg and soft contrast overlays. Desktop/mobile screenshots verified artwork and readable balance, network selector works, no horizontal overflow or runtime errors. Not published.
- [x] Moved contact access into the Contacts button at the bottom of Settings with support@mysteryum.com and document links; removed repeated links from Community and the shared wallet footer. Verified dialog destinations, desktop/mobile layout, absence of repeated links and runtime errors; build OK. Not published.
- [x] Secured Community reads/writes for Google accounts only and cleared protected content after sign-out; verified live policies and revoked anonymous SELECT. Both RLS findings marked fixed; basic security scan clean. Upgraded vulnerable dependencies including compatible Jayson 5 override; production dependency scan clean and live Solana RPC reads passed. Replaced deprecated server validators; build OK.
- [x] Implemented shared Community chat with Google sign-in, stored messages and reactions, five particle-burst reactions, live Mysteryum Bot replies and bot acknowledgements; preserved wallpaper. Desktop/mobile public views verified without runtime errors; build OK. Not published.
- [ ] Verify authenticated Community sending, bot replies, reactions, reload persistence and cross-session updates — blocked: minted test token lacks verified Google provider metadata, so policies correctly reject it; actual Google sign-in is required. Do not weaken access policies to accommodate the test token.
- [ ] Resolve separately reported unrestricted paid AI consultant/strategy access — needs owner decision on legitimate access limits; not changed as part of contacts/security-policy request.
- [x] Replaced retired email throughout project files with support@mysteryum.com; main wallet views show support/document links only. Verified Settings, Chat, Explore and Portfolio without email, support/privacy contact links, live AI contact response and build OK. Not published.
- [x] Install approved file_40298-2.jpg as PWA icon, favicon, apple-touch-icon and all manifest sizes; verified served PNG dimensions and launcher label MYSTERYUM WALLET. Rejected file_40299.jpg not used. Publication and physical phone installation remain external steps.
- [x] Verified native SOL/BTC/ETH detail opening; added official native links and exact-mint Solscan/DexScreener/Birdeye/Jupiter/Raydium destinations plus Orca/Meteora. Corrected the invalid Solana USDT mint in catalog and balances to the official Tether mint; restored USDT and black Ethereum icons. Desktop/mobile UI checks passed without runtime errors.
- [x] Installed newly supplied EconToken, JKPGM and KPGM artwork by exact Solana mint in asset lists and token details; verified rendered images.
- [x] Remove legacy public branding, update official metadata/share banner and shield icons; preserve token identity and existing wallet data. Verified page titles, descriptions, images and no runtime errors.
- [x] Keep SOL, USDC, USDT, JKPGM, KPGM, EconToken, BTC and ETH prominent; all other tokens in Other crypto, verified through the interface.
- [x] Replace portfolio and link-preview banner with the new gold crown/key artwork (file_40288.jpg); verified desktop/mobile and matching absolute share-image tags.
- [x] Premium artwork refresh: circular shield, onboarding shield, portfolio banner and AI avatar; verified desktop and mobile.
- [x] Priority asset list, Other crypto search/address adding (Solana), exact-identity market metrics; missing values stay unavailable.
- [x] Rebrand with uploaded shield logo, masked portrait and bottom navigation; mockups remain references, not real financial data.
- [x] Add token detail view with contract identity, public market data when available and explorer links.
- [x] Add working Explore and Settings views while preserving existing swap, wallet and trading controls.
- [ ] Community photo sharing and reports — Google accounts and text chat implemented; photo storage and moderation remain outside this request.
- [ ] Native biometric unlock — requires secure native key storage and device verification; never imitate biometric security.
- [ ] Fully translated additional languages — requires complete translations, not an untranslated language selector.
- [ ] NFT portfolio, xStocks and futures — requires verified asset/provider integration and eligibility checks.
- [x] Показати повні адреси токенів і мережі в портфелі, гаманці та обміні; рідні монети позначити без контракту.
- [ ] Виправити збереження фрази й пароля; відтворити та перевірити створення/відновлення гаманця.
- [ ] Перевірити й виправити відображення знайдених токенів і балансів.
- [ ] Перевірити дві критичні помилки: відкриття головної сторінки та незмінність підтвердженої суми обміну.
- [ ] Вбудувати сайт в Android-застосунок, перевірити незалежний запуск і оновити архів для завантаження.
- [x] Уточнено й оновлено назву, опис та фото посилання MYSTERYUM WALLET; зміни на публічному сайті потребують наступної публікації.
- [ ] Універсальний гаманець: пріоритет Solana → Bitcoin → Ethereum → інші; показувати всі токени Solana (будь-які мемтокени/альткоїни), обмін будь-якого токена за адресою.
- [ ] GPT-консультант: сам відповідає про будь-яку криптовалюту, не відсилає до творця.
- [ ] У список Solana додати BTC, ETH, TON, JUP, RAY та інші популярні токени Solana.
- [ ] Дати посилання для оновлення застосунку (після публікації).
- [x] Кожен токен має свій значок (портфель, гаманець, обмін).
- [x] Англійська — головна мова за замовчуванням; переклади UA/RU/ES лишаються.
- [x] GPT-консультант як професійний адміністратор гаманця: вирішує всі питання.
- [x] GPT: живі дані про будь-яку монету (ціна, капіталізація, справжня адреса) — CoinGecko + каталог Jupiter.
- [ ] Перевірка справжніх адрес монет (знак ✓, захист від підробок).
- [ ] Спільнота: чат з фото для користувачів (потрібна база даних Lovable Cloud).
- [ ] Віртуальна картка (потрібен партнер-емітент карток) — на потім.
- [ ] Підключення до інших гаманців, DEX/DeFi та бірж (WalletConnect тощо) — на потім.
- [x] Пошук інформації про монету за адресою (через GPT).
- [ ] Торгівля акціями (як у Solflare, токенізовані акції на Solana) — на потім.
- [ ] Мови: угорська, польська, турецька, японська, китайська та інші.
- [ ] Кілька гаманців з логотипом різних кольорів і сортуванням за кольором.
- [ ] Прохання приховати комісії від клієнтів — НЕ робимо: комісію треба показувати (вимога магазинів і закону).
- [x] Own self-custody wallet: create/restore, encrypted phrase on device
- [x] Addresses + balances: Solana (SOL/USDC/USDT), Ethereum (ETH/USDC/USDT), Bitcoin, XRP, Stellar
- [x] Send SOL, receive with QR, show phrase
- [x] Languages UA/RU/EN/ES (wallet screens + menu)
- [x] Answered: project access belongs to the owner
- [x] Live swap via Jupiter with 1% owner fee
- [x] Google Search Console: verified, site added, sitemap submitted (Sep 25 2026)
- [ ] Send for tokens and other networks (USDC/USDT send)
- [ ] Live swap with real funds not yet executed by owner (quote verified only)
- [ ] Owner needs USDC/USDT fee accounts on 7xyX…ufS (send a tiny amount to clear the NO_FEE_ACCOUNT hint)
- [ ] Publish to Google Play / App Store (Android build needs Android SDK on owner machine or CI; STORE_SUBMISSION.md ready)
- [ ] Custom domain kpgmwallet.com — deferred by owner ($11.10/yr, ready to buy)
- [ ] Token KPGM not yet launched (Launch screen stays demo)
- [ ] Future (after wallet): 3 new projects on the KPGM logo — website, AI, TikTok-like social platform
- [ ] Maybe: built-in trading agent bot (auto-trading tokens of all major crypto) — idea only, owner decision pending

## Поточне завдання (Sep 24, вечір)
- [ ] Google Play: користувач завантажує Android Studio; ZIP KPGM-Wallet-Mobile.zip відправлено в чат (шлях без GitHub)
- [ ] Далі за планом: сайт на компі -> Apple/App Store через Codemagic
- [x] Додати екран «Підтримка» (/support) з покроковими інструкціями Windows 11 / Google Play / App Store Connect, переклад 4 мов, посилання з застосунку
- [x] Опублікувати попереднє оновлення контактів — запущено Sep 25
- [ ] Зібрати новий signed APK (.aab) — тільки на комп-тері власника (Android Studio); ZIP уже з новою поштою
- [ ] Підготувати завантаження APK в Google Play

## Open (Oct 11)
- [ ] More app languages (PL, HU, TR, JA, ZH, DE, FR) — needs full translation pass
- [ ] Community feed with photos — needs Lovable Cloud (accounts + storage + moderation)
- [ ] Tokenized stocks — needs verified xStocks mint list on Solana
- [ ] Exchange/DEX links (WalletConnect) — needs WalletConnect project ID

## Oct 12
- [x] Головний екран: великий логотип, напис «Вас вітає екосистема нового покоління KPGM Wallet», технічний рядок унизу
- [x] Перевірка 3 випадкових слів фрази після створення гаманця
- [x] Зашифрований файл-резерв: зберегти / відновити з файлу
- [x] Історія надходжень і витрат (Solana) з посиланням на Solscan, оновлення щохвилини
- [ ] Біометрія (палець / обличчя) — у застосунку Android/iPhone, коли буде ноутбук
- [ ] 130+ мов — потрібен великий переклад, наступний етап
- [ ] Паспорт монети (творець, ліквідність, попередження про підробку)

## Phantom-style rebuild (requested 2026-10-14)
- [x] Clean home: account chip with copy, network switch, total balance + 24h, 4 round actions, tabs Tokens/xStocks/Perps/Earn/NFT, wSOL in main list, Buy dialog (MoonPay: Google Pay / card)
- [ ] Multiple wallets with names/avatars, add/import (needs vault migration keeping existing key)
- [ ] Per-wallet reveal private key / seed behind password/biometrics; Google backup
- [ ] Fee line shown only on final send/swap confirmation
- [ ] Token detail chart + history
- [x] Swap nav icon = key image (file_40725.jpg)
- [x] Oct 15: SPL token sending (token picker, decimals validation, recipient ATA creation, simulation, local signing). Not tested with live funds.
- [ ] WalletConnect v2 (QR/wc: pairing, sessions in Settings → Connected apps, sign approve/reject) built — blocked: needs VITE_WALLETCONNECT_PROJECT_ID from cloud.reown.com.
- [x] Capacitor Android: server URL fixed to live published site (old one returned 404), biometric/camera/notification permissions, backup of local vault disabled. Native biometric plugin still not installed.
- [ ] Solana RPC verified live (health, blockhash, mint decimals); SPL/SOL review checks (balance, decimals, fee) verified on real address. Signed broadcast — blocked: needs a wallet funded with SOL for fees.

- [x] Додати Bitcoin у фільтр мереж (All networks / Solana / Ethereum) на головному екрані
- [x] Settings rebuilt: search, profile card, sub-pages with Back (accounts, preferences, security, networks, contacts, connected apps, developer, help, about)
- [x] New working prefs: hide zero balances (filters home list), haptics, auto-lock timer, network toggles, devnet switch, cache clear, address book
- [ ] AI support chat inside Settings → Help (currently FAQ + email + support page links)
- [x] October 17: NFT studio «Наші NFT» block — owner can add/remove their own NFT collection links (name + full https URL, validated, stored locally per device) shown as outline chips with external-link icon; verified add, reject invalid URL with message, persist after reload, remove; build OK. Not published.
- [ ] Invite/QR link should open the wallet directly, not a registration page (clarify with owner)

## Oct 17 17:54
- [x] Прибрати «Купити/Вивести» з верхньої панелі (лишити в меню/профілі)
- [x] Прибрати сірий текст про активи без ціни з головного екрана
- [x] Прибрати напис під картками про дизайн

## Oct 17 18:04
- [x] Верхня панель: видалити Галерею, Купити/Вивести, мікрофон
- [x] Головний екран: прибрати перемикач акаунтів і «+ Рахунок»; керування акаунтами лише в профілі
- [x] Опублікувати на live

## Oct 17 18:26
- [x] Зменшити шрифт балансу (.home-balance strong) щоб не ліз на маску/бейджі
- [x] «All networks» прибрати з маски, поставити під картками над списком токенів
- [x] Акаунти прибрати з маски; компактний чіп акаунта під маскою перед картками
- [x] HomeCards: живі баланси на кожній картці (актив + баланс + еквівалент)
- [x] Прибрати замок (LockKeyhole) з віртуальних карток
- [x] Картки: видно одну активну, клік розгортає решту 7
- [ ] Опублікувати на live
- Oct 17 21:15: AI consultant and strategy drafts require sign-in (security fix)

## Oct 18 Telegram request (open)
- [x] Link preview uses carbon mask share image
- [x] Network picker beside account, Solana default, remembered
- [x] Card Rename/Design moved into three-dot menu
- [ ] Solflare-style token/stock detail: live candles (1s/1m/15m/1h/4h), market status, cap/volume/liquidity, PnL, socials, per-asset swap activity, pinned Buy/Sell
- [ ] Tabs Portfolio / Market / Browser / Cards
- [ ] Auto-list all positive SPL tokens incl. memecoins/xStocks (verify after token-read fix)
- [ ] AI: dedupe, move consultant to profile, free public DEX analytics (AI answers still need workspace credits)
- [ ] Staking interactive offers with live APY; History mask/background

## 2026-10-18 fixes
- [x] Monitoring/Popular rows open the coin details (chart), not the AI.
- [x] Home screen has no AI buttons; AI consultant lives in the account profile (and bottom AI tab).
- [x] Charts: 1-second frame removed (paid-only at GeckoTerminal), 5m added, retries on temporary refusals.
- [x] Staking: free public Solana nodes refuse stake-account search; summary now uses the SOL balance ("Ready to stake"), Solscan link for native stake accounts, real validator picker from the network.
- [ ] Native stake broadcast with a funded wallet not yet verified end-to-end.

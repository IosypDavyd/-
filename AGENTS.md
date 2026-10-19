<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Token identity uses TokenAddress with Solana mint values and the shared Ethereum contract registry; native coins never get invented contract addresses, and unavailable values are never inferred from symbols.
- Token detail destinations come from token-links using chain and contract identity; native links are official coin/network pages, and DEX destinations never imply liquidity or wallet connection.
- Shared market reads use exact Solana mints, case-insensitive ETH contracts, explicit native IDs; never FDV as cap. Wallet refreshes publish networks independently; failed reads retain address-scoped confirmed amounts, successful zero replaces them to avoid flicker without hiding withdrawals.
- Uploaded artwork is referenced through Lovable Assets pointers; only derived device icons are bundled so source media stays out of the repository.
- Wallet secrets remain in the device-encrypted vault; Cloud is for community data only and must never receive recovery phrases or private keys. Vaults restored from a Solana private key store the raw Base58 key with kind:"pk" (never normalized — case-sensitive); they restore only the Solana address and cannot add derived accounts.
- Community reads and writes require a server-verified Google identity, with owner-scoped reaction mutations and Realtime plus polling fallback; official bot replies are created only by an authenticated ownership-checked server function, so guests cannot read stored chat and users cannot impersonate the bot. Auth state is subscribed once by the root CommunitySession provider, separate from the device wallet, and never uses wallet secrets.
- Public branding changes must preserve existing vault/storage keys, native application identifiers, contact destinations and exact token identities to preserve wallets.
- Leaf routes import the shared social-image constant from the asset pointer; root metadata never supplies share images, preventing inherited preview overrides.
- Wallet contact and legal links are centralized in the Settings contact dialog, not repeated in shared or Community footers, without duplicates.
- Keep the Solana SDK's Jayson dependency on the secure compatible release via package overrides; its browser RPC client must remain API-compatible to protect wallet network reads.
- Stock, perpetual and xStocks discovery cards share MarketSections and use official issuer artwork and product pages, separate from wallet token identities; provider navigation is explicitly external and no prices, position ratios, mint addresses or trade availability are invented before a verified market integration exists.
- Staking uses wallet-scoped public reads with per-request RPC fallback and independent availability. Never auto-rebroadcast. Native stake uses validated votes, rent/fees, blockhash-preserving simulation and local signing; liquid staking opens official providers. Yield reads reject stale/invalid official data; never infer native APY.
- Voice commands use browser speech recognition with explicit audio privacy disclosure and deterministic parsing; commands open drafts only and never unlock or sign transactions.
- Scam Shield checks exact Solana mint accounts, authorities, Jupiter verification and exact-base DexScreener liquidity; simulations gate transfer/swap review without claiming safety guarantees. Swap signs the same prepared transaction after local password unlock.
- DCA schedules remain local, risk-checked plans with no unattended execution; copytrading requires a separately verified provider and explicit authorization architecture.
- WalletSettings hosts security-only WalletPanel controls; secret reveal retains local password checks so moving controls never bypasses vault protection.
- WalletPreferences persists fiat and balance-unit choices separately; crypto equivalents use exact-identity token-market prices and unavailable rates remain unavailable to avoid fabricated values.
- Fiat operations use fiat-providers for official destinations; hosted flows, partner information and own-account services remain distinct. Unsupported payouts stay disabled; unsigned URLs never prefill addresses. Asset codes and receiving addresses match the network; country/currency choices never guarantee eligibility.
- HomeCards and VirtualCardDialog share internal crypto-asset cards and address-scoped skin storage; profile/dialog cards reuse public balance reads with exact token identities and confirmed-value retention, never bank credentials or payment-card issuance. Preserve storage keys.
- Authenticated AI wrappers call consultant.server.ts after caller checks; capture stream errors. Community photos are transient, never public storage. Preserve the AI provider; disclose absent stock feeds.
- The home QR encodes the published application URL, never a wallet payment address, so sharing cannot be mistaken for receiving funds.
- Vault catalogue defines avatar tiers and a poster archive; local purchase receipts distinguish box rewards from direct purchases and never imply on-chain NFT minting. Unsupported achievement integrations stay locked to avoid fabricated activity.

# Cross-Check Web

A single-page governance dashboard for creating proposals and voting on an
Ethereum smart contract, built with React, TypeScript, Vite and wagmi.

The app targets a governance contract deployed on the Sepolia testnet.
Without a connected wallet it falls back to bundled demo proposals and
localStorage persistence, so the whole interface can be explored without
touching a chain; failed contract calls also degrade to simulated local
votes rather than breaking the UI.

- **Proposal dashboard.** Lists active and past proposals with vote
  counts, status badges and per-proposal detail pages.
- **Create proposals.** Wallet-signed `createProposal` transactions with
  a preview step and future-deadline validation.
- **Vote.** Cast for or against through the connected wallet, with
  optimistic UI updates while the transaction confirms.
- **Results and profile.** Results page plus a per-account vote and
  transaction history persisted in localStorage.
- **Network switcher.** Settings page toggles between Ethereum mainnet,
  Sepolia, Polygon mainnet and Mumbai via Web3Modal.
- **Contract layer.** `src/blockchain/` holds the governance ABI,
  contract address and the `useGovernance` hook behind all chain reads
  and writes.

## Run it

Needs Node.js 18+ and npm. An Ethereum wallet (for example MetaMask via
WalletConnect) is only required for real on-chain actions.

```bash
npm install
npm run dev
```

Vite prints the local URL (default `http://localhost:5173`).
`npm run build` produces a static bundle in `dist/` and `npm run lint`
runs ESLint.

Hardcoded configuration to review before deploying anywhere real:

| Setting | Location | Current value |
| --- | --- | --- |
| Governance contract | `src/blockchain/contracts.ts` | Sepolia `0x8B79…fFd7` |
| WalletConnect project ID | `src/providers/Web3Provider.tsx` | bundled in source |
| Storage keys | `useGovernance.ts`, `App.tsx` | `governdao_*` in localStorage |

## License

Apache License 2.0. See [LICENSE](LICENSE) and [NOTICE](NOTICE).

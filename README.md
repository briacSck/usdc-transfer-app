# USDC Transfer App

A minimal decentralized app (dApp) that sends **USDC** on the **Sepolia testnet**, built with
[viem](https://viem.sh) and React. A hands-on blockchain training project — connect a wallet,
enter a recipient and amount, send an ERC-20 `transfer`, and watch the transaction receipt come
back on-chain.

> ⚠️ **Training / experiment.** Runs on the Sepolia **testnet** only, with test funds that have
> no real value. The code is not audited — do not use it with mainnet or real assets.

## What it does

1. **Connect** your MetaMask wallet.
2. Enter a **recipient address** and an **amount** of USDC.
3. **Send** — the app encodes an ERC-20 `transfer` call and asks your wallet to sign it.
4. **Receipt** — it waits for the transaction to be mined and displays the full receipt.

## Tech stack

- **[viem](https://viem.sh)** — TypeScript library for interacting with Ethereum
- **React 18** + **TypeScript**
- **Vite** — dev server and build tool

## Prerequisites

- **[Node.js](https://nodejs.org)** (v18+)
- **[MetaMask](https://metamask.io)** browser extension, switched to the **Sepolia** network
- Some **Sepolia test ETH** for gas — grab it from a faucet such as
  [sepoliafaucet.com](https://sepoliafaucet.com) or the
  [Google Cloud Sepolia faucet](https://cloud.google.com/application/web3/faucet/ethereum/sepolia)
- Some **test USDC** on Sepolia to actually transfer

The USDC contract this app talks to on Sepolia:
`0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238`

## Getting started

```bash
npm install
npm run dev
```

Then open **http://localhost:5173** and click **Connect Wallet**.

> If you see a message like *"No Ethereum wallet detected"*, make sure MetaMask is installed,
> enabled for `localhost`, and set to the Sepolia network — then reload.

### Available scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the Vite dev server (hot reload) |
| `npm run build` | Type-check and build for production into `dist/` |
| `npm run preview` | Preview the production build locally |

## How it works

A few core viem concepts this project demonstrates:

- **Public client** — reads from the chain (here, `waitForTransactionReceipt`). Uses an HTTP
  transport, no wallet needed.
- **Wallet client** — signs and sends transactions. Uses a `custom` transport backed by the
  browser wallet's `window.ethereum` provider. It's created lazily, so the app still loads if
  no wallet is present yet.
- **ABI + `encodeFunctionData`** — the ERC-20 `transfer(address,uint256)` function is described
  by a small ABI, and viem encodes the call into transaction `data`.
- USDC uses **6 decimals**, so an amount is multiplied by `10 ** 6` before sending.

## Project structure

```
usdc-transfer-app/
├── index.html          # Vite entry point
├── src/
│   └── main.tsx        # the whole app: clients, ABI, connect + send + receipt UI
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## Notes

This is a learning project — expect rough edges, and feel free to add your own screenshot of the
running app here once you've made a transfer.

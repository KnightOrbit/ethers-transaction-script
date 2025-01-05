# Ethers Transaction Script

A Node.js script that demonstrates how to:

1. **Load environment variables** for configuring a provider and wallet (private key).
2. **Parse a JSON file** containing one or more contract addresses and associated call data (function data).
3. **Check wallet balance** before each transaction to ensure you have enough gas.
4. **Send a transaction** (even if it may revert) and log the resulting hash and receipt status.

---

## Table of Contents

1. [Overview](#overview)  
2. [Repository Structure](#repository-structure)  
3. [Prerequisites](#prerequisites)  
4. [Installation](#installation)  
5. [Environment Variables](#environment-variables)  
6. [Configuration (calls.json)](#configuration-callsjson)  
7. [Usage](#usage)  
8. [Notes](#notes)  
9. [License](#license)

---

## Overview

This project showcases a **Node.js** script using [ethers.js](https://docs.ethers.org/) to send transactions to smart contracts on Ethereum or EVM-compatible networks. It reads multiple contract calls from a JSON file and executes them sequentially. This script is useful when you have many transactions to send or function calls to test.

Key highlights:

- **Automatic** chain detection from your provider.  
- **Balance checks** before sending each transaction.  
- Logs all **transaction hashes** and **receipt statuses** (success or revert).  
- Easy to configure via a **`.env` file** and **JSON file**.

---

## Repository Structure

```
ethers-transaction-script
│
├── calls.json       // Contains a list of contract calls and associated function data
├── index.js         // Main script to send transactions
├── .env             // Environment variables (NOT committed to source control)
├── package.json     // Project dependencies and scripts
└── README.md        // This file
```

---

## Prerequisites

- **Node.js** (v14 or higher recommended)
- **Yarn** or **npm** (for installing dependencies)
- A valid **Ethereum provider** (e.g., Infura, Alchemy, or any JSON RPC endpoint)
- A valid **private key** with sufficient ETH (or the chain’s native currency) to cover gas fees.

---

## Installation

1. **Clone** this repository:

   ```bash
   git clone https://github.com/knightorbit/ethers-transaction-script.git
   cd ethers-transaction-script
   ```

2. **Install dependencies** with Yarn:

   ```bash
   yarn
   ```

   Or, if you prefer npm:

   ```bash
   npm install
   ```

---

## Environment Variables

Create a `.env` file in the root of the project. It should include:

```bash
PRIVATE_KEY=0xYourPrivateKeyHere
PROVIDER=https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID
WALLET_ADDRESS=0xYourWalletAddress (optional, derived from PRIVATE_KEY if missing)
```

**Variables**:

- **`PRIVATE_KEY`**: Must be a private key with funds for gas (required).
- **`PROVIDER`**: A valid JSON RPC endpoint (e.g., Infura, Alchemy, local node, etc.).
- **`WALLET_ADDRESS`**: Optional. If omitted, the wallet address is derived from `PRIVATE_KEY`.

**Security Notice**:

- Never commit your `.env` file or your **private key** to a public repository.
- Always add `.env` to your `.gitignore`.

---

## Configuration (`calls.json`)

Create or modify `calls.json` to specify the contract calls you want to make. It can include multiple entries, each entry having:
- A `contractAddress` field
- A `functionDataList` array of raw encoded function calls (bytecode).

Example `calls.json`:

```json
{
  "calls": [
    {
      "contractAddress": "0x047D8FdB30D7542c2A91Fec274CD0CD91BDD4068",
      "functionDataList": [
        "0x455277be0000000000000000000000000000000000000000000000000000000000000040...",
        "0xabcdef1234567890..."
      ]
    },
    {
      "contractAddress": "0x1234567890abcdef1234567890abcdef12345678",
      "functionDataList": [
        "0xaaaaaaa000000000000000000000000000000000000000000000000000000000000bbb..."
      ]
    }
  ]
}
```

---

## Usage

1. **Update** `calls.json` with the contract addresses and function data you wish to execute.
2. **Confirm** your `.env` file has the correct `PRIVATE_KEY` and `PROVIDER`.
3. **Run the script**:

   ```bash
   yarn start
   ```

   or:

   ```bash
   node index.js
   ```

The script will:

1. Read your `.env` configuration.
2. Initialize an ethers **provider** and **wallet**.
3. Parse each contract call from `calls.json`.
4. Check your wallet’s **ETH balance** (or native currency) before each transaction.
5. Send each transaction, logging the **transaction hash** and waiting for the **receipt**.
6. Print the **receipt status**: `1` for success, `0` for revert (failed transaction).

---

## Notes

- **Transaction Reverts**: If a transaction reverts, you will still pay gas. The script’s output will show `status = 0`.
- **Custom Gas**: You can configure `gasLimit`, `gasPrice`, or `maxFeePerGas` if needed in the transaction object.
- **Custom Logic**: If you want to handle partial success/failure differently, modify the script’s `try/catch` blocks or flow.

---

## License

This project is licensed under the [MIT License](./LICENSE).  
Feel free to modify and use it for your own purposes. 

---

**Happy Coding!**  
If you have any questions or need additional help, feel free to open an issue or submit a pull request.
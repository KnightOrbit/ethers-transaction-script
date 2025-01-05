/**
 * index.js
 * ------------------------------------------------------
 * Reads multiple contract calls from a JSON file and sends
 * transactions using ethers.js and environment variables.
 */

require('dotenv').config();
const { ethers, JsonRpcProvider } = require('ethers');
const callsData = require('./calls.json'); // <-- Loads your JSON file

/** -----------------------------
 * Environment Variables
 * ------------------------------
 */
const {
  PRIVATE_KEY,
  PROVIDER,
  WALLET_ADDRESS, // optional; can be derived from PRIVATE_KEY
} = process.env;

/** -----------------------------
 * Validate Environment Variables
 * ------------------------------
 */
if (!PRIVATE_KEY) {
  console.error('Missing PRIVATE_KEY in .env');
  process.exit(1);
}
if (!PROVIDER) {
  console.error('Missing PROVIDER in .env');
  process.exit(1);
}

/** -----------------------------
 * Main Function
 * ------------------------------
 */
async function main() {
  try {
    // 1. Initialize provider from ENV
    const provider = new JsonRpcProvider(PROVIDER);

    // 2. Create Wallet
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    const walletAddress = WALLET_ADDRESS || wallet.address;

    // 3. Fetch the Network / Chain ID
    const network = await provider.getNetwork();
    console.log(`\nConnected to chainId: ${network.chainId}`);
    console.log(`Wallet Address: ${walletAddress}`);

    // 4. For each call in the calls.json file
    for (const { contractAddress, functionDataList } of callsData.calls) {
      console.log(`\nProcessing calls for contract: ${contractAddress}`);

      // For each function data entry
      for (const functionData of functionDataList) {
        // // 4A. Check wallet balance before sending the tx
        // const balance = await wallet.getBalance();
        // console.log(`Current Wallet Balance: ${ethers.utils.formatEther(balance)} ETH`);

        // // Optional: check if balance is above some threshold
        // const minRequiredBalance = ethers.utils.parseEther('0.01'); // Adjust as needed
        // if (balance.lt(minRequiredBalance)) {
        //   console.error('Insufficient balance to cover gas fees. Skipping this transaction.');
        //   continue; // skip this transaction and go to next
        // }

        // 4B. Create transaction object
        const tx = {
          to: contractAddress,
          data: functionData,
          // value: ethers.utils.parseEther("0.0"),  // if the contract call requires ETH
          gasLimit: 3_000_000                     // optionally specify a gas limit
        };

        console.log(`\nSending transaction to: ${contractAddress}`);
        console.log(`Transaction data: ${tx.data}`);

        // 4C. Send the transaction
        let txResponse, receipt;
        try {
          txResponse = await wallet.sendTransaction(tx);
          console.log(`Transaction sent. Hash: ${txResponse.hash}`);

          // 4D. Wait for the transaction receipt
          receipt = await txResponse.wait();
          console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
          console.log(`Receipt status: ${receipt.status}`);

          if (receipt.status === 0) {
            console.warn('Transaction reverted (status = 0).');
          } else {
            console.log('Transaction succeeded (status = 1).');
          }
        } catch (error) {
          console.error('Error sending transaction:', error);
        }
      }
    }
  } catch (error) {
    console.error('An error occurred in main():\n', error);
    process.exit(1);
  }
}

/** -----------------------------
 * Run Script
 * ------------------------------
 */
main();

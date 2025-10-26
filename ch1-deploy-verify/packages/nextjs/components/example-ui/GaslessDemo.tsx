"use client";

import { useState } from "react";
import { parseEther } from "viem";
import { useAccount } from "wagmi";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

/**
 * GaslessDemo Component
 *
 * This component demonstrates the concept of gasless transactions using ERC-4337 Account Abstraction.
 *
 * What are Gasless Transactions?
 * - Users can send transactions WITHOUT paying gas fees
 * - A "paymaster" contract pays the gas fees on behalf of users
 * - Uses ERC-4337 standard with Smart Contract Wallets
 *
 * How it works:
 * 1. User creates a transaction (e.g., transfer tokens)
 * 2. Transaction is wrapped in a "UserOperation"
 * 3. Paymaster approves and sponsors the gas fees
 * 4. Bundler submits the transaction to the blockchain
 * 5. User's transaction executes without them paying gas!
 *
 * For a full implementation, you would:
 * 1. Install thirdweb SDK: yarn add thirdweb
 * 2. Set up a Smart Wallet with paymaster
 * 3. Configure gasless transactions for your contracts
 *
 * Learn more: https://portal.thirdweb.com/wallet/smart-wallet
 */

export const GaslessDemo = () => {
  const { address: connectedAddress } = useAccount();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");

  // Regular transaction (user pays gas)
  const { writeAsync: transferWithGas } = useScaffoldContractWrite({
    contractName: "MyToken",
    functionName: "transfer",
    args: [recipient as `0x${string}`, amount ? parseEther(amount) : 0n],
  });

  const handleTransferWithGas = async () => {
    if (!recipient || !amount) return;

    try {
      await transferWithGas();
      setRecipient("");
      setAmount("");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="card w-full bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Gasless Transactions Demo</h2>
        <p className="text-sm text-gray-500">
          Learn about ERC-4337 Account Abstraction and Sponsored Transactions
        </p>

        {/* Info Section */}
        <div className="alert alert-info mt-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div>
            <h3 className="font-bold">What are Gasless Transactions?</h3>
            <div className="text-xs">
              With ERC-4337, users can send transactions without paying gas fees.
              A "paymaster" sponsors the transaction costs, improving user experience.
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="collapse collapse-arrow bg-base-200 mt-4">
          <input type="checkbox" />
          <div className="collapse-title font-medium">
            How Gasless Transactions Work
          </div>
          <div className="collapse-content text-sm">
            <ol className="list-decimal list-inside space-y-2 mt-2">
              <li><strong>Smart Wallet:</strong> User deploys a smart contract wallet (ERC-4337)</li>
              <li><strong>UserOperation:</strong> Transaction is bundled into a UserOperation object</li>
              <li><strong>Paymaster:</strong> Paymaster contract approves and sponsors gas fees</li>
              <li><strong>Bundler:</strong> Bundler submits transaction to blockchain</li>
              <li><strong>Execution:</strong> Transaction executes without user paying gas!</li>
            </ol>
          </div>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="card bg-success text-success-content">
            <div className="card-body p-4">
              <h3 className="card-title text-sm">✅ Benefits</h3>
              <ul className="text-xs list-disc list-inside">
                <li>No gas fees for users</li>
                <li>Better UX onboarding</li>
                <li>Social recovery</li>
                <li>Batch transactions</li>
              </ul>
            </div>
          </div>

          <div className="card bg-primary text-primary-content">
            <div className="card-body p-4">
              <h3 className="card-title text-sm">🛠️ Use Cases</h3>
              <ul className="text-xs list-disc list-inside">
                <li>Gaming (free mints)</li>
                <li>DeFi (sponsored swaps)</li>
                <li>NFTs (free transfers)</li>
                <li>Social apps</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Implementation Guide */}
        <div className="divider">Implementation with thirdweb</div>

        <div className="mockup-code text-xs">
          <pre data-prefix="1"><code>// Install thirdweb SDK</code></pre>
          <pre data-prefix="2"><code>yarn add thirdweb</code></pre>
          <pre data-prefix="3"><code></code></pre>
          <pre data-prefix="4"><code>// Setup Smart Wallet with Paymaster</code></pre>
          <pre data-prefix="5"><code>import {"{ThirdwebProvider, smartWallet}"} from "thirdweb/wallets";</code></pre>
          <pre data-prefix="6"><code></code></pre>
          <pre data-prefix="7"><code>const wallet = smartWallet({"{"}paymasterUrl: "..."{"}"};</code></pre>
        </div>

        {/* Demo Transaction Form */}
        <div className="divider">Try Regular Transaction (You Pay Gas)</div>

        {!connectedAddress ? (
          <div className="alert alert-warning">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>Connect wallet to try transactions</span>
          </div>
        ) : (
          <div className="form-control gap-2">
            <input
              type="text"
              placeholder="Recipient address (0x...)"
              className="input input-bordered"
              value={recipient}
              onChange={e => setRecipient(e.target.value)}
            />
            <input
              type="number"
              step="0.01"
              placeholder="Amount (LSEA tokens)"
              className="input input-bordered"
              value={amount}
              onChange={e => setAmount(e.target.value)}
            />
            <button
              className="btn btn-primary"
              onClick={handleTransferWithGas}
              disabled={!recipient || !amount}
            >
              Send Transaction (You Pay Gas)
            </button>
            <p className="text-xs text-gray-500 text-center">
              💡 With gasless transactions, the paymaster would pay the gas fee for you!
            </p>
          </div>
        )}

        {/* Learn More */}
        <div className="card bg-base-200 mt-4">
          <div className="card-body p-4">
            <h3 className="font-bold text-sm">📚 Learn More About ERC-4337</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              <a
                href="https://eips.ethereum.org/EIPS/eip-4337"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-xs btn-outline"
              >
                EIP-4337 Spec
              </a>
              <a
                href="https://portal.thirdweb.com/wallet/smart-wallet"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-xs btn-outline"
              >
                thirdweb Docs
              </a>
              <a
                href="https://www.alchemy.com/account-abstraction"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-xs btn-outline"
              >
                Account Abstraction Guide
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

"use client";

import { useState } from "react";
import { getContract, prepareContractCall, sendTransaction } from "thirdweb";
import { useActiveAccount } from "thirdweb/react";
import { liskSepoliaThirdweb } from "~~/chains";
import deployedContracts from "~~/contracts/deployedContracts";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";
import { thirdwebClient } from "~~/services/web3/thirdwebConfig";
import { notification } from "~~/utils/scaffold-eth";

export const SmartWalletDemo = () => {
  const [mintToAddress, setMintToAddress] = useState("");
  const [isLoadingNFT, setIsLoadingNFT] = useState(false);
  const account = useActiveAccount();

  // Get contract address from deployments
  const nftAddress = deployedContracts?.[4202]?.MyNFT?.address as `0x${string}` | undefined;

  const { data: totalSupply, refetch: refetchSupply } = useScaffoldContractRead({
    contractName: "MyNFT",
    functionName: "totalSupply",
  });

  const { data: userNFTBalance, refetch: refetchBalance } = useScaffoldContractRead({
    contractName: "MyNFT",
    functionName: "balanceOf",
    args: [account?.address as `0x${string}`],
  });

  const handleGaslessMint = async () => {
    const targetAddress = mintToAddress || account?.address;

    if (!targetAddress || !account || !nftAddress) {
      notification.error("Please connect wallet");
      return;
    }

    setIsLoadingNFT(true);

    try {
      // Create thirdweb contract instance
      const nftContract = getContract({
        client: thirdwebClient,
        chain: liskSepoliaThirdweb,
        address: nftAddress,
      });

      // Prepare the contract call
      const transaction = prepareContractCall({
        contract: nftContract,
        method: "function mint(address to)",
        params: [targetAddress as `0x${string}`],
      });

      // Send transaction - gas is automatically sponsored! 🎉
      const { transactionHash } = await sendTransaction({
        transaction,
        account,
      });

      notification.success(
        `Gasless NFT minted! View on Blockscout: https://sepolia-blockscout.lisk.com/tx/${transactionHash}`,
      );

      setMintToAddress("");

      // Refresh data
      setTimeout(() => {
        refetchSupply();
        refetchBalance();
      }, 2000);
    } catch (error: any) {
      console.error("Mint failed:", error);
      notification.error(error.message || "Mint failed");
    } finally {
      setIsLoadingNFT(false);
    }
  };

  return (
    <div className="flex justify-center gap-6 flex-col sm:flex-row">
      {/* Gasless NFT Minting */}
      <div className="card w-full max-w-2xl bg-base-100 shadow-xl mx-auto">
        <div className="card-body">
          <h2 className="card-title">🎨 Mint NFT (100% Gasless!)</h2>

          <div className="stats stats-vertical shadow mb-4">
            <div className="stat">
              <div className="stat-title">Total Minted</div>
              <div className="stat-value text-secondary">{totalSupply?.toString() || "0"}</div>
            </div>
            <div className="stat">
              <div className="stat-title">You Own</div>
              <div className="stat-value text-accent">{userNFTBalance?.toString() || "0"}</div>
            </div>
            <div className="stat">
              <div className="stat-title">Smart Wallet</div>
              <div className="stat-desc text-xs font-mono">
                {account?.address?.slice(0, 10)}...{account?.address?.slice(-8)}
              </div>
            </div>
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Mint to address (optional)</span>
            </label>
            <input
              type="text"
              placeholder="Leave empty to mint to yourself"
              className="input input-bordered w-full"
              value={mintToAddress}
              onChange={e => setMintToAddress(e.target.value)}
            />
          </div>

          <div className="card-actions justify-end mt-4">
            <button className="btn btn-primary" onClick={handleGaslessMint} disabled={isLoadingNFT}>
              {isLoadingNFT ? "Minting..." : "Mint NFT (Gas Free!)"}
            </button>
          </div>

          <div className="alert alert-success mt-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-xs">✨ Minting sponsored by thirdweb paymaster - $0 gas cost!</span>
          </div>

          {/* How It Works */}
          <div className="collapse collapse-arrow bg-base-200 mt-4">
            <input type="checkbox" />
            <div className="collapse-title font-medium">
              🧠 How ERC-4337 Gasless Transactions Work
            </div>
            <div className="collapse-content text-sm">
              <ol className="list-decimal list-inside space-y-2 mt-2">
                <li><strong>Smart Wallet:</strong> Your programmable account (ERC-4337)</li>
                <li><strong>UserOperation:</strong> Transaction bundled with sponsor signature</li>
                <li><strong>Paymaster:</strong> thirdweb sponsors the gas fees</li>
                <li><strong>Bundler:</strong> Submits transaction to blockchain</li>
                <li><strong>Execution:</strong> NFT minted - you paid $0!</li>
              </ol>

              <div className="mt-4 p-3 bg-info rounded text-info-content">
                <p className="font-bold">Key Insight:</p>
                <p className="text-xs">Your existing MyNFT contract from Week 1 works perfectly! No modifications needed. ERC-4337 works with ANY contract.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

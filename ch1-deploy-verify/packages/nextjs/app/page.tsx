"use client";

import type { NextPage } from "next";
import Link from "next/link";
import { useAccount } from "wagmi";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

const Home: NextPage = () => {
  const { address: connectedAddress, isConnected } = useAccount();

  // Get token balance
  const { data: tokenBalance } = useScaffoldContractRead({
    contractName: "MyToken",
    functionName: "balanceOf",
    args: [connectedAddress],
  });

  // Get NFT balance
  const { data: nftBalance } = useScaffoldContractRead({
    contractName: "MyNFT",
    functionName: "balanceOf",
    args: [connectedAddress],
  });

  // Get total NFT supply
  const { data: totalNFTSupply } = useScaffoldContractRead({
    contractName: "MyNFT",
    functionName: "totalSupply",
  });

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10 pb-12">
        {/* Hero Section */}
        <div className="px-5 text-center mb-12 max-w-4xl">
          <h1 className="text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Lisk SEA dApp
            </span>
          </h1>
          <p className="text-2xl font-semibold text-base-content/80 mb-3">Week 4 Challenge Complete</p>
          <p className="text-base-content/60">
            Smart Contracts • Oracle Integration • Gasless Transactions • Event Tracking
          </p>
        </div>

        <div className="w-full max-w-7xl px-4 sm:px-8 space-y-8">
          {/* Wallet Connection Status */}
          {!isConnected ? (
            <div className="alert alert-warning shadow-lg">
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
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span>Please connect your wallet to view your dashboard</span>
            </div>
          ) : (
            /* Quick Stats */
            <div className="stats stats-vertical lg:stats-horizontal shadow w-full bg-base-100">
              <div className="stat">
                <div className="stat-figure text-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="inline-block w-8 h-8 stroke-current"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    ></path>
                  </svg>
                </div>
                <div className="stat-title">LSEA Token Balance</div>
                <div className="stat-value text-primary">
                  {tokenBalance ? (Number(tokenBalance) / 1e18).toFixed(2) : "0"}
                </div>
                <div className="stat-desc">ERC-20 Tokens</div>
              </div>

              <div className="stat">
                <div className="stat-figure text-secondary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="inline-block w-8 h-8 stroke-current"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    ></path>
                  </svg>
                </div>
                <div className="stat-title">NFTs Owned</div>
                <div className="stat-value text-secondary">{nftBalance?.toString() || "0"}</div>
                <div className="stat-desc">
                  Total Minted: {totalNFTSupply?.toString() || "0"}
                </div>
              </div>

              <div className="stat">
                <div className="stat-figure text-accent">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="inline-block w-8 h-8 stroke-current"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    ></path>
                  </svg>
                </div>
                <div className="stat-title">Network</div>
                <div className="stat-value text-accent text-2xl">Lisk</div>
                <div className="stat-desc">Sepolia Testnet</div>
              </div>
            </div>
          )}

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link
              href="/debug"
              className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all hover:scale-105"
            >
              <div className="card-body">
                <div className="text-4xl mb-2">💎</div>
                <h2 className="card-title text-base-content">Token Operations</h2>
                <p className="text-base-content/70 text-sm">Transfer LSEA tokens and manage your balance</p>
                <div className="card-actions justify-end">
                  <button className="btn btn-primary btn-sm">Explore →</button>
                </div>
              </div>
            </Link>

            <Link
              href="/debug"
              className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all hover:scale-105"
            >
              <div className="card-body">
                <div className="text-4xl mb-2">🎨</div>
                <h2 className="card-title text-base-content">NFT Collection</h2>
                <p className="text-base-content/70 text-sm">Mint and manage your unique NFTs</p>
                <div className="card-actions justify-end">
                  <button className="btn btn-secondary btn-sm">Explore →</button>
                </div>
              </div>
            </Link>

            <Link
              href="/debug"
              className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all hover:scale-105"
            >
              <div className="card-body">
                <div className="text-4xl mb-2">📊</div>
                <h2 className="card-title text-base-content">Price Oracle</h2>
                <p className="text-base-content/70 text-sm">Real-time ETH & BTC prices via RedStone</p>
                <div className="card-actions justify-end">
                  <button className="btn btn-accent btn-sm">View Prices →</button>
                </div>
              </div>
            </Link>

            <Link
              href="/events"
              className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all hover:scale-105"
            >
              <div className="card-body">
                <div className="text-4xl mb-2">📜</div>
                <h2 className="card-title text-base-content">Event History</h2>
                <p className="text-base-content/70 text-sm">Track all token & NFT transactions</p>
                <div className="card-actions justify-end">
                  <button className="btn btn-info btn-sm">View Events →</button>
                </div>
              </div>
            </Link>
          </div>

          {/* Challenge Completion Status */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-4 text-base-content">🏆 Challenge Progress</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="badge badge-success badge-lg">✓</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-base-content">Challenge 1: Deploy & Verify</h3>
                    <p className="text-sm text-base-content/70">Smart contracts deployed on Lisk Sepolia</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="badge badge-success badge-lg">✓</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-base-content">Challenge 2: Frontend Integration</h3>
                    <p className="text-sm text-base-content/70">Connected UI with Token & NFT operations</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="badge badge-success badge-lg">✓</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-base-content">Challenge 3: Event Tracking</h3>
                    <p className="text-sm text-base-content/70">Display contract events and transaction history</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="badge badge-success badge-lg">✓</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-base-content">Challenge 4: Oracle & Gasless</h3>
                    <p className="text-sm text-base-content/70">
                      RedStone Oracle integration + ERC-4337 Account Abstraction
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card bg-gradient-to-r from-primary to-secondary text-primary-content shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl">🚀 Quick Actions</h2>
              <div className="flex flex-wrap gap-3 mt-4">
                <Link href="/debug" className="btn btn-ghost bg-white/20 hover:bg-white/30">
                  🔧 Debug Contracts
                </Link>
                <Link href="/events" className="btn btn-ghost bg-white/20 hover:bg-white/30">
                  📜 View Events
                </Link>
                <Link href="/blockexplorer" className="btn btn-ghost bg-white/20 hover:bg-white/30">
                  🔍 Block Explorer
                </Link>
                <a
                  href="https://sepolia-blockscout.lisk.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost bg-white/20 hover:bg-white/30"
                >
                  🌐 Lisk Explorer
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;

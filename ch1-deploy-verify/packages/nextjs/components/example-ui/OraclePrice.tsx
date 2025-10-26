"use client";

import { useState } from "react";
import { formatUnits, parseUnits } from "viem";
import { useAccount } from "wagmi";
import { useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

export const OraclePrice = () => {
  const { address: connectedAddress } = useAccount();
  const [symbol, setSymbol] = useState("ETH/USD");
  const [newPrice, setNewPrice] = useState("");

  // Read the current price
  const { data: priceData } = useScaffoldContractRead({
    contractName: "PriceFeed",
    functionName: "getPrice",
    args: [symbol],
  });

  // Read if price is fresh (updated within last hour)
  const { data: isFresh } = useScaffoldContractRead({
    contractName: "PriceFeed",
    functionName: "isPriceFresh",
    args: [symbol],
  });

  // Read the updater address
  const { data: updater } = useScaffoldContractRead({
    contractName: "PriceFeed",
    functionName: "updater",
  });

  // Write function to update price (only updater can call)
  const { writeAsync: updatePriceAsync } = useScaffoldContractWrite({
    contractName: "PriceFeed",
    functionName: "updatePrice",
    args: [symbol, newPrice ? parseUnits(newPrice, 8) : 0n],
  });

  const handleUpdatePrice = async () => {
    if (!newPrice) return;

    try {
      await updatePriceAsync();
      setNewPrice("");
    } catch (error) {
      console.error("Error updating price:", error);
    }
  };

  const isUpdater = connectedAddress?.toLowerCase() === updater?.toLowerCase();

  return (
    <div className="card w-full bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Oracle Price Feed</h2>

        {/* Price Symbol Selector */}
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Price Pair</span>
          </label>
          <select
            className="select select-bordered"
            value={symbol}
            onChange={e => setSymbol(e.target.value)}
          >
            <option value="ETH/USD">ETH/USD</option>
            <option value="BTC/USD">BTC/USD</option>
            <option value="LISK/USD">LISK/USD</option>
          </select>
        </div>

        {/* Current Price Display */}
        <div className="stats shadow mt-4">
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
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                ></path>
              </svg>
            </div>
            <div className="stat-title">Current Price</div>
            <div className="stat-value text-primary">
              {priceData ? `$${formatUnits(priceData[0], 8)}` : "N/A"}
            </div>
            <div className="stat-desc">
              {priceData && priceData[1] ? (
                <>
                  Updated: {new Date(Number(priceData[1]) * 1000).toLocaleString()}
                  <br />
                  <span className={`badge badge-sm ${isFresh ? "badge-success" : "badge-warning"}`}>
                    {isFresh ? "Fresh" : "Stale"} (within 1 hour)
                  </span>
                </>
              ) : (
                "No price data available"
              )}
            </div>
          </div>
        </div>

        {/* Update Price (Only for Updater) */}
        {isUpdater && (
          <div className="divider">Update Price (Authorized)</div>
        )}

        {isUpdater && (
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">New Price (USD with 8 decimals)</span>
              <span className="label-text-alt">You are the authorized updater</span>
            </label>
            <div className="join w-full">
              <input
                type="number"
                step="0.01"
                placeholder="2000.00"
                className="input input-bordered join-item flex-1"
                value={newPrice}
                onChange={e => setNewPrice(e.target.value)}
              />
              <button
                className="btn btn-primary join-item"
                onClick={handleUpdatePrice}
                disabled={!newPrice}
              >
                Update
              </button>
            </div>
            <label className="label">
              <span className="label-text-alt">
                Enter price in dollars (e.g., 2000 for $2000)
              </span>
            </label>
          </div>
        )}

        {!connectedAddress && (
          <div className="alert alert-info mt-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>Connect your wallet to view and interact with the oracle</span>
          </div>
        )}

        {connectedAddress && !isUpdater && (
          <div className="alert alert-warning mt-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>Only the authorized updater can modify prices</span>
          </div>
        )}
      </div>
    </div>
  );
};

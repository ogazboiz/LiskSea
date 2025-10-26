"use client";

import { useState } from "react";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { PriceDisplay } from "~~/components/example-ui/PriceDisplay";

const Oracle: NextPage = () => {
  const { isConnected } = useAccount();

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="card w-96 bg-base-100 shadow-xl">
          <div className="card-body text-center">
            <h2 className="card-title justify-center">🔮 Oracle Price Feeds</h2>
            <p>Please connect your wallet to view live prices</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center mb-4">🔮 Live Price Feeds</h1>
        <p className="text-center text-gray-600">Real-time cryptocurrency prices powered by RedStone Oracle</p>
      </div>

      <div className="flex justify-center items-center gap-6 flex-col sm:flex-row">
        <PriceDisplay symbol="ETH" />
        <PriceDisplay symbol="BTC" />
      </div>

      {/* How RedStone Works */}
      <div className="mt-12 max-w-4xl mx-auto">
        <div className="collapse collapse-arrow bg-base-200">
          <input type="checkbox" />
          <div className="collapse-title text-xl font-medium">
            🧠 How RedStone Pull Oracle Works
          </div>
          <div className="collapse-content">
            <div className="space-y-4 text-sm">
              <p><strong>Traditional Oracle (Push):</strong> Data stored on-chain → More expensive → Always available</p>
              <p><strong>RedStone Pull:</strong> Data in transaction calldata → Cheaper → Fetched on-demand</p>

              <div className="steps steps-vertical lg:steps-horizontal mt-4">
                <div className="step step-primary">User clicks "Refresh"</div>
                <div className="step step-primary">RedStone API fetches latest prices</div>
                <div className="step step-primary">Prices appended to transaction</div>
                <div className="step step-primary">Smart contract verifies signatures</div>
                <div className="step step-primary">Price displayed!</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Oracle;

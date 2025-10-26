"use client";

import { useEffect, useState } from "react";
import { WrapperBuilder } from "@redstone-finance/evm-connector";
import { getSignersForDataServiceId } from "@redstone-finance/sdk";
import { ethers } from "ethers";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";

interface PriceDisplayProps {
  symbol: "ETH" | "BTC";
}

export const PriceDisplay = ({ symbol }: PriceDisplayProps) => {
  const [price, setPrice] = useState<string>("0.00");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const { data: deployedContractData } = useDeployedContractInfo("PriceFeed");

  const fetchPrice = async () => {
    if (!deployedContractData) {
      setError("PriceFeed contract not deployed. Run: yarn deploy");
      setIsLoading(false);
      return;
    }

    if (typeof window === "undefined" || !window.ethereum) {
      setError("Please connect your wallet to view prices");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      // Create ethers provider from window.ethereum
      const provider = new ethers.providers.Web3Provider(window.ethereum as any);

      // Create ethers contract instance
      const contract = new ethers.Contract(deployedContractData.address, deployedContractData.abi, provider);

      // Get authorized signers for redstone-main-demo service
      const authorizedSigners = getSignersForDataServiceId("redstone-main-demo");

      // Wrap contract with RedStone data
      const wrappedContract = WrapperBuilder.wrap(contract).usingDataService({
        dataServiceId: "redstone-main-demo",
        dataPackagesIds: [symbol],
        authorizedSigners: authorizedSigners,
        uniqueSignersCount: Math.max(1, Math.floor(authorizedSigners.length / 2)),
      });

      // Call the appropriate price function
      const priceData = symbol === "ETH" ? await wrappedContract.getEthPrice() : await wrappedContract.getBtcPrice();

      if (!priceData) {
        throw new Error("No price data returned from oracle");
      }

      // Format price (8 decimals to 2 decimals)
      const formattedPrice = (Number(priceData) / 1e8).toFixed(2);
      setPrice(formattedPrice);
      setLastUpdate(new Date());
    } catch (error) {
      console.error(`Error fetching ${symbol} price:`, error);
      setError(error instanceof Error ? error.message : "Failed to fetch price");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrice();
    // Refresh every 30 seconds
    const interval = setInterval(fetchPrice, 30000);
    return () => clearInterval(interval);
  }, [deployedContractData, symbol]);

  const iconSymbol = symbol === "ETH" ? "Ξ" : "₿";

  return (
    <div className="card w-full bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title justify-center text-2xl">
          {iconSymbol} {symbol}/USD
        </h2>

        {error ? (
          <div className="alert alert-error">
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
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm">{error}</span>
          </div>
        ) : isLoading ? (
          <div className="flex justify-center py-8">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="text-sm text-gray-500 mb-2">Current Price</div>
            <div className="text-4xl font-bold text-primary mb-2">${price}</div>
            <div className="text-xs text-gray-400">
              Updated: {lastUpdate.toLocaleTimeString()}
            </div>
          </div>
        )}

        <div className="card-actions justify-end mt-4">
          <button className="btn btn-sm btn-outline" onClick={fetchPrice} disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="loading loading-spinner loading-xs"></span>
                Refreshing...
              </>
            ) : (
              <>🔄 Refresh</>
            )}
          </button>
        </div>

        <div className="alert alert-info mt-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="stroke-current shrink-0 w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <span className="text-xs">Powered by RedStone Pull Oracle</span>
        </div>
      </div>
    </div>
  );
};

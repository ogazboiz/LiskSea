"use client";

import type { NextPage } from "next";
import { NFTCollection } from "~~/components/example-ui/NFTCollection";
import { OraclePrice } from "~~/components/example-ui/OraclePrice";
import { TokenBalance } from "~~/components/example-ui/TokenBalance";
import { TokenTransfer } from "~~/components/example-ui/TokenTransfer";

const Home: NextPage = () => {
  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5 text-center mb-8">
          <h1 className="text-4xl font-bold">Lisk SEA Challenge 2</h1>
          <p className="text-lg mt-2">Connect Your Contracts to Frontend</p>
          <p className="text-sm text-gray-500 mt-1">Interact with your MyToken and MyNFT contracts on Lisk Sepolia</p>
        </div>

        <div className="flex-grow bg-base-300 w-full mt-8 px-8 py-12">
          <div className="flex justify-center items-start gap-6 flex-col">
            {/* Oracle Price Feed - Challenge 4 */}
            <div className="w-full max-w-4xl mx-auto">
              <OraclePrice />
            </div>

            {/* Token and NFT Components - Challenge 2 */}
            <div className="flex justify-center items-start gap-6 flex-col sm:flex-row w-full">
              <div className="flex flex-col px-10 py-10 text-center items-center rounded-3xl flex-1">
                <TokenBalance />
              </div>
              <div className="flex flex-col px-10 py-10 text-center items-center rounded-3xl flex-1">
                <TokenTransfer />
              </div>
              <div className="flex flex-col px-10 py-10 text-center items-center rounded-3xl flex-1">
                <NFTCollection />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;

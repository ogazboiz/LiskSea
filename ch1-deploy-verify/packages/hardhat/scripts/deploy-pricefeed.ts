import { ethers } from "hardhat";

async function main() {
  console.log("Deploying PriceFeed contract...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH");

  const PriceFeed = await ethers.getContractFactory("PriceFeed");
  const priceFeed = await PriceFeed.deploy();

  await priceFeed.waitForDeployment();

  const address = await priceFeed.getAddress();
  console.log("PriceFeed deployed to:", address);

  // Set an initial price for ETH/USD (e.g., $2000 with 8 decimals)
  const ethUsdPrice = "200000000000"; // $2000.00000000
  console.log("Setting initial ETH/USD price to: $2000");

  const tx = await priceFeed.updatePrice("ETH/USD", ethUsdPrice);
  await tx.wait();
  console.log("Initial price set successfully!");

  // Verify the price was set
  const priceData = await priceFeed.getPrice("ETH/USD");
  console.log("Stored price:", ethers.formatUnits(priceData[0], 8));
  console.log("Timestamp:", new Date(Number(priceData[1]) * 1000).toISOString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

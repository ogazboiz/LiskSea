import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

/**
 * Deploys MyToken (ERC20) and MyNFT (ERC721) contracts
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployContracts: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  /*
    On localhost, the deployer account is the one that comes with Hardhat, which is already funded.

    When deploying to live networks (e.g `yarn deploy --network liskSepolia`), the deployer account
    should have sufficient balance to pay for the gas fees for contract creation.

    You can generate a random account with `yarn generate` which will fill DEPLOYER_PRIVATE_KEY
    with a random private key in the .env file (then used on hardhat.config.ts)
    You can run the `yarn account` command to check your balance in every network.
  */
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  // Deploy ERC20 Token
  await deploy("MyToken", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });

  // Deploy ERC721 NFT
  await deploy("MyNFT", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });

  // Deploy PriceFeed Oracle (Challenge 4)
  await deploy("PriceFeed", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });
};

export default deployContracts;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags MyToken
deployContracts.tags = ["MyToken", "MyNFT", "PriceFeed"];

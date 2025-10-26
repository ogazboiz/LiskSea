import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const deploySimpleUSDC: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("SimpleUSDC", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });
};

export default deploySimpleUSDC;
deploySimpleUSDC.tags = ["SimpleUSDC"];

import { HardhatRuntimeEnvironment } from "hardhat/types"; // Import Hardhat runtime environment types
import { DeployFunction } from "hardhat-deploy/types"; // Import deploy function types
import { VotingContract } from "../typechain-types"; // Import types for the VotingContract

/**
 * Deployment script for the VotingContract.
 * Utilizes Hardhat Runtime Environment (HRE) for deployment functions and utilities.
 *
 * @param hre Hardhat runtime environment object.
 */
const deployPollManager: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  // Extract the deployer account
  const { deployer } = await hre.getNamedAccounts();

  // Retrieve an instance of the deployed contract
  const pollManagerInstance = await hre.ethers.getContract<VotingContract>("PollManager", deployer);

  // Confirm successful deployment by invoking a sample method
  console.log("🚀 Deployment successful! Contract greeting:", await pollManagerInstance.greeting());
};

// Export the deployment function for Hardhat usage
export default deployPollManager;

// Assign a tag to the script for easier selection during Hardhat commands
deployPollManager.tags = ["PollManager"];

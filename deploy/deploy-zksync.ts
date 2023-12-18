// Note that the deployment scripts must be placed in the `deploy` folder for `hardhat deploy-zksync`
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Wallet } from "zksync-ethers";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";

// Colour codes for terminal prints
const RESET = "\x1b[0m";
const GREEN = "\x1b[32m";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default async function main(hre: HardhatRuntimeEnvironment) {
  // Get the private key from the configured network
  // This assumes that a private key is configured for the selected network
  const accounts = hre.network.config.accounts;
  if (!Array.isArray(accounts)) {
    throw new Error(
      `No private key configured for network ${hre.network.name}`,
    );
  }
  const PRIVATE_KEY = accounts[0];
  if (typeof PRIVATE_KEY !== "string") {
    throw new Error(
      `No private key configured for network ${hre.network.name}`,
    );
  }

  const wallet = new Wallet(PRIVATE_KEY);
  const deployer = new Deployer(hre, wallet);

  const constructorArgs = ["Hello, Hardhat!"];
  const artifact = await deployer.loadArtifact("Greeter");
  const contract = await deployer.deploy(artifact, constructorArgs);

  await contract.waitForDeployment();
  const contractAddress = await contract.getAddress();

  console.log("Greeter deployed to: " + `${GREEN}${contractAddress}${RESET}\n`);

  console.log(
    "Waiting 30 seconds before beginning the contract verification to allow the block explorer to index the contract...\n",
  );
  await delay(30000); // Wait for 30 seconds before verifying the contract

  await hre.run("verify:verify", {
    address: contractAddress,
    constructorArguments: constructorArgs,
  });
}

// Note that the deployment scripts must be placed in the `deploy` folder for `hardhat deploy-zksync`
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Wallet } from "zksync2-js";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";

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

  const artifact = await deployer.loadArtifact("Greeter");
  const contract = await deployer.deploy(artifact, ["Hello, Hardhat!"]);

  await contract.waitForDeployment();

  console.log("Greeter deployed to:", await contract.getAddress());
}

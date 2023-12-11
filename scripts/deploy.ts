import hre from "hardhat";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const constructorArgs = ["Hello, Hardhat!"];
  const contract = await hre.ethers.deployContract("Greeter", constructorArgs);

  await contract.waitForDeployment();
  const contractAddress = await contract.getAddress();

  console.log("Greeter deployed to:", contractAddress);

  await delay(30000); // Wait for 30 seconds before verifying the contract

  await hre.run("verify:verify", {
    address: contractAddress,
    constructorArguments: constructorArgs,
  });

  // Uncomment if you want to enable the `tenderly` extension
  // await hre.tenderly.verify({
  //   name: "Greeter",
  //   address: contractAddress,
  // });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

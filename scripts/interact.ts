// An example script that shows how to interact programmatically with a deployed contract
// You must customise it according to your contract's specifications
import { ethers } from "hardhat";

async function main() {
  const contract = await ethers.getContractFactory("Greeter");
  const address = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Specify your contract address here

  ////////////////
  //  PAYLOAD  //
  //////////////

  const newGreeting = "Buongiorno!"; // Specify here the payload of the to-be-called function

  ///////////////
  //  ATTACH  //
  /////////////

  const Contract = contract.attach(address);

  ////////////////
  //  SENDING  //
  //////////////

  const tx = await Contract.setGreeting(newGreeting); // Specify here the to-be-called function name
  console.log("The transaction hash is:", tx.hash);
  const receipt = await tx.wait();
  console.log(
    "The transaction returned the following transaction receipt:\n",
    receipt
  );
}

// To run it, invoke `npx hardhat run scripts/interact.ts --network <network_name>`
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

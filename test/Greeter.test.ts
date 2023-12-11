import { expect, assert } from "chai";
import hre from "hardhat";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { mine, time } from "@nomicfoundation/hardhat-network-helpers";
import { Greeter } from "../typechain-types";

describe("Greeter", function () {
  let deployerAccount: SignerWithAddress;
  let greeter: Greeter;

  beforeEach(async function () {
    greeter = await hre.ethers.deployContract(
      "Greeter",
      ["Hello, Hardhat!"],
      deployerAccount,
    );
    await greeter.waitForDeployment();
  });

  it("Should return the new greeting once it's changed", async function () {
    expect(await greeter.greet()).to.equal("Hello, Hardhat!");

    const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

    // Wait until the transaction is mined
    await setGreetingTx.wait();

    expect(await greeter.greet()).to.equal("Hola, mundo!");
  });

  // Showcase test on how to use the Hardhat network helpers library
  it("Should mine the given number of blocks", async function () {
    const blockNumberBefore = await time.latestBlock();

    await mine(100);

    assert.equal(await time.latestBlock(), blockNumberBefore + 100);
  });
});

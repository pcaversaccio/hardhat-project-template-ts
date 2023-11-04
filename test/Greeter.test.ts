import { expect, assert } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { mine, time } from "@nomicfoundation/hardhat-network-helpers";

describe("Greeter", function () {
  let deployerAccount: SignerWithAddress;
  let greeter: Contract;

  beforeEach(async function () {
    greeter = await ethers.deployContract("Greeter", ["Hello, Hardhat!"], {
      from: deployerAccount,
    });
    await greeter.waitForDeployment();
  });

  it("Should return the new greeting once it's changed", async function () {
    expect(await greeter.greet()).to.equal("Hello, Hardhat!");

    const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

    // wait until the transaction is mined
    await setGreetingTx.wait();

    expect(await greeter.greet()).to.equal("Hola, mundo!");
  });

  // showcase test on how to use the Hardhat network helpers library
  it("Should mine the given number of blocks", async function () {
    const blockNumberBefore = await time.latestBlock();

    await mine(100);

    assert.equal(await time.latestBlock(), blockNumberBefore + 100);
  });
});

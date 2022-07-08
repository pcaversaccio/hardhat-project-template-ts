import { expect, assert } from "chai";
import { ethers } from "hardhat";
import { mine, time } from "@nomicfoundation/hardhat-network-helpers";

describe("Greeter", function () {
  it("Should return the new greeting once it's changed", async function () {
    const Greeter = await ethers.getContractFactory("Greeter");
    const greeter = await Greeter.deploy("Hello, world!");
    await greeter.deployed();

    expect(await greeter.greet()).to.equal("Hello, world!");

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

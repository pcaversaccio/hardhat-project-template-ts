// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

import "hardhat/console.sol";
import "../Greeter.sol";
import "../lib/ds-test/src/test.sol";

contract ContractTest is DSTest {
    Greeter public greeter;

    function setUp() public {}

    function testCreateGreeter() public {
        greeter = new Greeter("Hello, world!");

        assertEq(greeter.greet(), "Hello, world!");

        greeter.setGreeting("Hola, mundo!");

        assertEq(greeter.greet(), "Hola, mundo!");
    }
}

// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.27;

import {Greeter} from "../src/Greeter.sol";
import {Test} from "forge-std/Test.sol";

contract GreeterTest is Test {
    Greeter public greeter;

    function setUp() public {
        greeter = new Greeter("Hello, Hardhat!");
    }

    function testCreateGreeter() public {
        assertEq(greeter.greet(), "Hello, Hardhat!");
        greeter.setGreeting("Hola, mundo!");
        assertEq(greeter.greet(), "Hola, mundo!");
    }
}

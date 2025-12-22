// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.33;

import {Test} from "forge-std/Test.sol";
import {Greeter} from "../src/Greeter.sol";

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

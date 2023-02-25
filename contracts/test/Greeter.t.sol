// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.19;

import {Greeter} from "../src/Greeter.sol";
import {Test} from "forge-std/Test.sol";

contract ContractTest is Test {
    Greeter public greeter;

    function setUp() public {
        greeter = new Greeter("Hello, world!");
    }

    function testCreateGreeter() public {
        assertEq(greeter.greet(), "Hello, world!");
        greeter.setGreeting("Hola, mundo!");
        assertEq(greeter.greet(), "Hola, mundo!");
    }
}

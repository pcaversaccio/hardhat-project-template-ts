// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.23;

import {CollateralPool} from "/CollateralPool.sol";

contract CollateralPoolFactory {
    address[] public deployedCollateralPools;

    constructor() {
        // some code if needed
    }

    // Function to create a new collateral pool
    function createCollateralPool(
        address _manager,
        address _collateralToken,
        uint256 _initialFundingAmount
    ) public {
        address newCollateralPool = address(
            new CollateralPool(
                _manager,
                _collateralToken,
                _initialFundingAmount
            )
        );
        deployedCollateralPools.push(newCollateralPool);
    }

    // Get the list of deployed collateral pools
    function getDeployedCollateralPools() public view returns (address[] memory) {
        return deployedCollateralPools;
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

interface ERC20TokenInterface {
    // get the balanceOf function from Token Contract Address
    function balanceOf(address who) external view returns (uint256);
}

contract checkBalanceOf {

    function balanceOf(address tokenContractAddress, address bankAddress) external view returns (uint256) {

        // creating a pointer to the Token Contract Address
        ERC20TokenInterface TokenContract = ERC20TokenInterface(tokenContractAddress);

        // getting balance of bankAddress
        return TokenContract.balanceOf(bankAddress);
    }
}
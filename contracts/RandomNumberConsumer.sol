// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

 
contract RandomNumberConsumer is VRFConsumerBase, Ownable {
    
    bytes32 internal keyHash;
    uint256 internal fee;
    uint256 public randomResult;
    uint256 public balance;
    
    constructor(address _VRFCoordinator, address _LinkToken, bytes32 _keyhash) 
    VRFConsumerBase(_VRFCoordinator, _LinkToken) {
        keyHash = _keyhash;
        fee = 0.1 * 10 ** 18; // 0.1 LINK (Varies by network)
    }
    
    // Requests randomness 
    function getRandomNumber() public returns (bytes32 requestId) {
        require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK");
        return requestRandomness(keyHash, fee);
    }

    // Callback function used by VRF Coordinator
    function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
        randomResult = randomness;
    }

    function checkBalance() external view returns (uint256) {
        return LINK.balanceOf(address(this));
    }

    // Withdraw function to avoid locking your LINK in the contract
    function withdrawLINK(uint256 numWithdraw) external payable onlyOwner {
        balance = LINK.balanceOf(address(this));
        require(balance > numWithdraw, "Not enought LINK left to withdraw");
        require(LINK.transfer(msg.sender, numWithdraw), "Transfer failed.");
    }
}
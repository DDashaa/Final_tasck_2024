// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

/**
 * A smart contract for receiving arbitrary payments
 * Allows tracking balance and withdrawal by the owner
 */
contract YourContract {
    // State Variables
    address public immutable owner;

    // Constructor: sets the owner of the contract
    constructor(address _owner) {
        owner = _owner;
    }

    // Modifier: restricts access to the owner
    modifier isOwner() {
        require(msg.sender == owner, "Not the Owner");
        _;
    }

    // Function to withdraw all Ether in the contract (only for the owner)
    function withdraw() public isOwner {
        (bool success, ) = owner.call{value: address(this).balance}("");
        require(success, "Failed to send Ether");
    }

    // Function to check the balance of the contract
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    // Fallback function to accept Ether
    receive() external payable {}
}

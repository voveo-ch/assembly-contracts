// SPDX-License-Identifier: MIT

pragma solidity ^0.8.6;

contract Owned {
    address payable internal owner;
    event feePaid(address to, uint256 amount);

    // creator is owner
    constructor() {
        owner = payable(msg.sender);
    }

    // only owner is allowed to call restricted function
    modifier restrict {
        require(msg.sender == owner, "access denied, you are not the contract owner");
        _;
    }
    // requires a fee for the owner
    modifier fee(uint256 amount) {
        require(msg.value >= amount, "not enough payment for the fee");
        _;
        owner.transfer(amount);
        emit feePaid(owner, amount);
    }

    function getOwner() public view returns (address payable) {
        return owner;
    }

    // allow update of the owner
    function changeOwner(address payable newOwner) public restrict {
        owner = newOwner;
    }

    // move whole balance to the owner
    function withdraw() public restrict {
        owner.transfer(address(this).balance);
    }
}

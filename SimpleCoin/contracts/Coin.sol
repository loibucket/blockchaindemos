// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract Coin {
    // The keyword "public" makes those variables
    // readable from outside.
    address public minter;
    mapping(address => uint256) public balances;

    // Events allow light clients to react on
    // changes efficiently.
    event Sent(address from, address to, uint256 amount);

    // This is the constructor whose code is
    // run only when the contract is created.
    constructor() {
        minter = msg.sender;
    }

    function mint(address receiver, uint256 amount) public {
        if (msg.sender != minter) revert();
        balances[receiver] += amount;
    }

    function transfer(address receiver, uint256 amount) public {
        if (balances[msg.sender] < amount) revert();
        balances[msg.sender] -= amount;
        balances[receiver] += amount;
        emit Sent(msg.sender, receiver, amount);
    }
}

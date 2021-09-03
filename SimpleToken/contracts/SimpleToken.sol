// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

// Simple NFT
contract SimpleToken {
    // The keyword "public" makes those variables
    // readable from outside.
    address public minter;
    // all content that has been minted
    string[] public creations;
    // does content exist
    mapping(string => bool) public exists;
    // ownership of content
    mapping(string => address) public ownership;

    // Events allow light clients to react on
    // changes efficiently.
    event Sent(address from, address to, string content);

    // This is the constructor whose code is
    // run only when the contract is created.
    constructor() {
        // the creator of this contract on the blockchain is the minter
        minter = msg.sender;
    }

    function mint(address receiver, string memory content) public {
        // only minter can mint new ownerships
        if (msg.sender != minter) revert();
        // content can only be minted once to a receiver, it cannot be re-minted
        if (exists[content]) revert();
        // push content into existence
        creations.push(content);
        exists[content] = true;
        ownership[content] = receiver;
    }

    function transfer(address receiver, string memory content) public {
        // no transfer if content does not exists
        if (exists[content] == false) revert();
        // only the content owner can transfer ownership
        if (ownership[content] != msg.sender) revert();
        ownership[content] = receiver;
        emit Sent(msg.sender, receiver, content);
    }
}

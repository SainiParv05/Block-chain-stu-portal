//stores the list of wallet addresses that are allowed to issue degrees 
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract IssuerRegistry {
    address public owner;
    // MAPPING: Think of this as a spreadsheet with two columns:
    // Column A: Wallet Address | Column B: Is Allowed? (True/False)
    mapping(address => bool) public issuers;

    event IssuerAdded(address indexed issuer);
    event IssuerRemoved(address indexed issuer);

    constructor() {
        owner = msg.sender; // The person deploying (You) becomes the Admin
        issuers[msg.sender] = true; // You are also the first authorized Issuer
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not Admin");
        _;
    }

    function addIssuer(address _issuer) external onlyOwner {
        issuers[_issuer] = true;
        emit IssuerAdded(_issuer);
    }

    function removeIssuer(address _issuer) external onlyOwner {
        issuers[_issuer] = false;
        emit IssuerRemoved(_issuer);
    }

    // Other contracts will call this function to check if someone is valid
    function isIssuer(address _addr) external view returns (bool) {
        return issuers[_addr];
    }
}
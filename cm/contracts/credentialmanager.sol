// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// What is it? This is the Storage Cabinet. It connects a Student's Wallet Address to the IPFS links (CIDs) of their degrees.

// Why do we need it? So that when a student logs in to your website, the website can ask the blockchain: "Give me the list of all degrees owned by Address 0xABC..."

import "./issuerregistry.sol";

contract CredentialManager {
    IssuerRegistry public issuerRegistry;
    
    // MAPPING: Student Address -> List of IPFS Strings
    mapping(address => string[]) public studentCredentials;

    event CredentialStored(address indexed student, string cid);

    constructor(address _issuerRegistryAddress) {
        issuerRegistry = IssuerRegistry(_issuerRegistryAddress);
    }

    function storeCredential(address _student, string memory _cid) external {
        require(issuerRegistry.isIssuer(msg.sender), "Not authorized to issue");
        studentCredentials[_student].push(_cid);
        emit CredentialStored(_student, _cid);
    }

    function getCredentials(address _student) external view returns (string[] memory) {
        return studentCredentials[_student];
    }
}
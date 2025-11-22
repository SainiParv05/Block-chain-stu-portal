// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// IMPORT: This tells Remix to look at your other file to understand what 'IssuerRegistry' is.
import "./issuerregistry.sol";

contract RevocationRegistry {
    
    IssuerRegistry public issuerRegistry;
    
    // MAPPING: Credential Hash (ID) -> Is Revoked? (True/False)
    mapping(string => bool) public revokedList;

    event Revoked(string indexed credId, address indexed by);

    // CONSTRUCTOR: This runs once when you deploy.
    // It asks: "Where is the IssuerRegistry located?" because we need to link them.
    constructor(address _issuerRegistryAddress) {
        issuerRegistry = IssuerRegistry(_issuerRegistryAddress);
    }

    function revoke(string memory _credId) external {
        // SECURITY CHECK: We ask the other contract: "Is the person calling this function a real University?"
        require(issuerRegistry.isIssuer(msg.sender), "Not authorized issuer");
        
        revokedList[_credId] = true;
        emit Revoked(_credId, msg.sender);
    }

    function isRevoked(string memory _credId) external view returns (bool) {
        return revokedList[_credId];
    }
}
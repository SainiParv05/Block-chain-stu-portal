const hre = require("hardhat");

async function main() {
  console.log("Starting deployment...");

  // 1. Deploy IssuerRegistry first
  // (It has no dependencies, so it goes first)
  const IssuerRegistry = await hre.ethers.getContractFactory("IssuerRegistry");
  const issuerRegistry = await IssuerRegistry.deploy();

  await issuerRegistry.waitForDeployment();
  const issuerAddress = await issuerRegistry.target; // In Ethers v6, .address is .target
  console.log(`IssuerRegistry deployed to: ${issuerAddress}`);

  // 2. Deploy CredentialManager
  // (It needs the IssuerRegistry address)
  const CredentialManager = await hre.ethers.getContractFactory("CredentialManager");
  const credentialManager = await CredentialManager.deploy(issuerAddress);

  await credentialManager.waitForDeployment();
  console.log(`CredentialManager deployed to: ${await credentialManager.target}`);

  // 3. Deploy RevocationRegistry
  // (It also needs the IssuerRegistry address)
  const RevocationRegistry = await hre.ethers.getContractFactory("RevocationRegistry");
  const revocationRegistry = await RevocationRegistry.deploy(issuerAddress);

  await revocationRegistry.waitForDeployment();
  console.log(`RevocationRegistry deployed to: ${await revocationRegistry.target}`);

  console.log("All contracts deployed successfully!");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
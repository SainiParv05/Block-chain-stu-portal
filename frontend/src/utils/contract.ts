import { ethers } from "ethers";

// ---------------------- CONTRACT CONFIG ----------------------

export const CREDENTIAL_MANAGER_ADDRESS =
  "0xf8e81D47203A594245E36C48e151709F0C19fBe8"; // <---- your real deployed contract

export const CREDENTIAL_MANAGER_ABI = [
  "function storeCredential(address _student, string _cid) public",
  "function getCredentials(address _student) public view returns (string[])"
];

// Hardhat local RPC (31337)
const LOCAL_RPC = "http://127.0.0.1:8545";


// ---------------------- PROVIDER ----------------------

export function getProvider() {
  try {
    // 1) Prefer Hardhat local RPC
    return new ethers.JsonRpcProvider(LOCAL_RPC);
  } catch (err) {
    console.warn("Hardhat RPC unavailable, fallback to MetaMask");
  }

  // 2) Fallback → MetaMask
  if ((window as any).ethereum) {
    return new ethers.BrowserProvider((window as any).ethereum);
  }

  throw new Error("No Ethereum provider found");
}


// ---------------------- SIGNER ----------------------

export async function getSigner() {
  // Try Hardhat unlocked account
  try {
    const provider = new ethers.JsonRpcProvider(LOCAL_RPC);
    const accounts = await provider.listAccounts();
    if (accounts.length > 0) return provider.getSigner(accounts[0].address);
  } catch (err) {
    console.warn("Local signer unavailable → fallback to MetaMask");
  }

  // Browser signer
  if ((window as any).ethereum) {
    const browserProvider = new ethers.BrowserProvider((window as any).ethereum);
    return browserProvider.getSigner();
  }

  throw new Error("No signer available");
}


// ---------------------- CONTRACT INSTANCE ----------------------

export function getCredentialContract(signerOrProvider: any) {
  return new ethers.Contract(
    CREDENTIAL_MANAGER_ADDRESS,
    CREDENTIAL_MANAGER_ABI,
    signerOrProvider
  );
}


// ---------------------- CONNECTED ADDRESS ----------------------

export async function getConnectedAddress() {
  // Hardhat
  try {
    const provider = new ethers.JsonRpcProvider(LOCAL_RPC);
    const accounts = await provider.listAccounts();
    if (accounts.length > 0) return accounts[0].address;
  } catch {}

  // MetaMask
  if ((window as any).ethereum) {
    const accounts = await (window as any).ethereum.request({
      method: "eth_requestAccounts"
    });
    return accounts[0];
  }

  return null;
}

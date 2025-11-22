require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
async function pinJSONToIPFS(jsonObj) {
  const PINATA_KEY = process.env.PINATA_API_KEY;
  const PINATA_SECRET = process.env.PINATA_API_SECRET;

  const url = "https://api.pinata.cloud/pinning/pinJSONToIPFS";

  const res = await axios.post(url, jsonObj, {
    headers: {
      "Content-Type": "application/json",
      pinata_api_key: PINATA_KEY,
      pinata_secret_api_key: PINATA_SECRET,
    }
  });

  return res.data.IpfsHash;
}

const axios = require('axios');
const crypto = require('crypto');
const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));

const PORT = process.env.PORT || 9696;


// Pinata client
const PINATA_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET = process.env.PINATA_API_SECRET;
//const pinata = PINATA_KEY && PINATA_SECRET ? pinataSDK(PINATA_KEY, PINATA_SECRET) : null;

// AES helper (AES-256-CBC with hex output)
const AES_SECRET = process.env.AES_SECRET || 'change_this_to_secure_value';
function encryptAESHex(plainJson) {
  // derive 32-byte key from secret
  const key = crypto.createHash('sha256').update(AES_SECRET).digest();
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  const encrypted = Buffer.concat([cipher.update(JSON.stringify(plainJson), 'utf8'), cipher.final()]);
  // return iv + ciphertext as hex
  return Buffer.concat([iv, encrypted]).toString('hex');
}
function decryptAESHex(hexStr) {
  const raw = Buffer.from(hexStr, 'hex');
  const iv = raw.slice(0, 16);
  const data = raw.slice(16);
  const key = crypto.createHash('sha256').update(AES_SECRET).digest();
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  const dec = Buffer.concat([decipher.update(data), decipher.final()]);
  return dec.toString('utf8');
}


// Load RevocationRegistry ABI you uploaded
const revocationAbiPath = path.join(__dirname, 'revocationregistry.json');
let revocationAbi = null;
if (fs.existsSync(revocationAbiPath)) {
  revocationAbi = JSON.parse(fs.readFileSync(revocationAbiPath, 'utf8'));
} else {
  console.warn('revocationregistry.json not found in backend folder. isRevoked endpoint will not work.');
}

// Ethereum provider & optional signer
const provider = new ethers.JsonRpcProvider(process.env.ETH_PROVIDER_URL || 'http://127.0.0.1:8545');
let adminSigner = null;
if (process.env.REVOKE_ADMIN_PRIVATE_KEY) {
  adminSigner = new ethers.Wallet(process.env.REVOKE_ADMIN_PRIVATE_KEY, provider);
}

// --- Endpoints ---

// Health
app.get('/', (req, res) => {
  res.json({ ok: true, now: new Date().toISOString() });
});

/**
 * POST /uploadCredential
 * Body: { studentAddress, issuerAddress, credential: { type, title, description, issueDate, expiryDate, ... } }
 * Response: { success: true, cid: 'Qm...' }
 *
 * This endpoint encrypts the credential (AES) and pins it to IPFS (via Pinata). Frontend expects a cid.
 */
app.post('/uploadCredential', async (req, res) => {
  try {
    const { studentAddress, issuerAddress, credential } = req.body;
    if (!studentAddress || !issuerAddress || !credential) {
      return res.status(400).json({ success: false, message: 'Missing fields' });
    }

    // attach metadata
    const payload = {
      holder: studentAddress,
      issuer: issuerAddress,
      credential,
      createdAt: new Date().toISOString()
    };

    // encrypt payload -> hex string
    const encryptedHex = encryptAESHex(payload);

    // pin encrypted hex as JSON to IPFS (so we store the ciphertext only)
    const ipfsObj = {
      encrypted: encryptedHex,
      meta: {
        app: 'SkillChain Passport',
        timestamp: new Date().toISOString(),
        holder: studentAddress,
        issuer: issuerAddress
      }
    };

    const cid = await pinJSONToIPFS(ipfsObj);

    return res.json({ success: true, cid });
  } catch (err) {
    console.error('uploadCredential err', err);
    return res.status(500).json({ success: false, message: err.message || 'upload failed' });
  }
});

/**
 * GET /getCredential?cid=...
 * Returns: { success: true, data: "<encrypted_hex>" }
 *
 * StudentWallet expects encrypted data and will decrypt client-side using same AES_SECRET.
 * StudentWallet calls this endpoint for each CID returned by contract.getCredentials(...).
 */
app.get('/getCredential', async (req, res) => {
  try {
    const cid = req.query.cid;
    if (!cid) return res.status(400).json({ success: false, message: 'cid required' });

    // If using Pinata, fetch via gateway URL (unpin/unrestricted public)
    // Pinata: https://gateway.pinata.cloud/ipfs/<cid>
    const gateway = `https://gateway.pinata.cloud/ipfs/${cid}`;
    const resp = await axios.get(gateway, { timeout: 15000 });
    // Try to return the encrypted string or the stored field
    const data = resp.data;
    // if we stored { encrypted: "<hex>", meta: { ... } }
    if (data && data.encrypted) {
      return res.json({ success: true, data: data.encrypted });
    } else {
      // maybe the user pinned raw ciphertext string - adapt
      return res.json({ success: true, data: typeof data === 'string' ? data : JSON.stringify(data) });
    }
  } catch (err) {
    console.error('getCredential err', err?.message || err);
    return res.status(500).json({ success: false, message: err.message || 'fetch failed' });
  }
});

/**
 * POST /verifyProof
 * Body: { proof: {...} }  OR arbitrary shape as your frontend sends
 * This endpoint demonstrates verifying the proof and performing extra checks: e.g., check revocation registry.
 *
 * For the demo: we'll accept proof.cid or proof.credId and call isRevoked on revocation contract.
 */
app.post('/verifyProof', async (req, res) => {
  try {
    const proof = req.body;
    // allow either root object or { proof: {} }
    const proofObj = proof.proof || proof;

    // Example: proofObj.cid or proofObj.credId
    const credId = proofObj.cid || proofObj.credId;
    let isRevoked = false;

    if (credId && revocationAbi && process.env.REVOCATION_REGISTRY_ADDRESS) {
      try {
        const regAddr = process.env.REVOCATION_REGISTRY_ADDRESS;
        const revContract = new ethers.Contract(regAddr, revocationAbi, provider);
        // The ABI exposes isRevoked(string) -> bool (from your uploaded ABI)
        isRevoked = await revContract.isRevoked(credId);
      } catch (err) {
        console.warn('revocation check failed', err?.message || err);
      }
    }

    // Here you would verify the ZK-proof, signatures, etc. For now we simulate verification result.
    const valid = !isRevoked; // simulation: valid if not revoked

    const response = {
      verified: Boolean(valid),
      revoked: Boolean(isRevoked),
      revealed: proofObj.revealed || null,
      proofId: proofObj.proofId || null,
      timestamp: Date.now()
    };

    return res.json(response);
  } catch (err) {
    console.error('verifyProof err', err);
    return res.status(500).json({ verified: false, error: err.message || 'verify failed' });
  }
});

/**
 * GET /isRevoked?credId=...
 * Direct revocation registry check using the ABI uploaded (revocationregistry.json).
 * Returns { success: true, revoked: true/false }
 */
app.get('/isRevoked', async (req, res) => {
  try {
    const credId = req.query.credId;
    if (!credId) return res.status(400).json({ success: false, message: 'credId required' });
    if (!revocationAbi || !process.env.REVOCATION_REGISTRY_ADDRESS) {
      return res.status(500).json({ success: false, message: 'revocation contract not configured' });
    }
    const regAddr = process.env.REVOCATION_REGISTRY_ADDRESS;
    const revContract = new ethers.Contract(regAddr, revocationAbi, provider);
    const revoked = await revContract.isRevoked(credId);
    return res.json({ success: true, revoked });
  } catch (err) {
    console.error('isRevoked err', err);
    return res.status(500).json({ success: false, message: err.message || 'call failed' });
  }
});

/**
 * OPTIONAL: POST /revokeCredential
 * Admin-only — this sends a transaction to revocation registry to revoke a credId.
 * Requires REVOKE_ADMIN_PRIVATE_KEY in .env (and an admin account permitted by the contract).
 */
app.post('/revokeCredential', async (req, res) => {
  try {
    const credId = req.body.credId;
    if (!credId) return res.status(400).json({ success: false, message: 'credId required' });
    if (!adminSigner) return res.status(500).json({ success: false, message: 'admin signer not configured' });
    if (!revocationAbi || !process.env.REVOCATION_REGISTRY_ADDRESS) {
      return res.status(500).json({ success: false, message: 'revocation contract not configured' });
    }

    const revContract = new ethers.Contract(process.env.REVOCATION_REGISTRY_ADDRESS, revocationAbi, adminSigner);
    const tx = await revContract.revoke(credId);
    const receipt = await tx.wait();
    return res.json({ success: true, txHash: receipt.transactionHash });
  } catch (err) {
    console.error('revokeCredential err', err);
    return res.status(500).json({ success: false, message: err.message || 'revoke failed' });
  }
});

app.listen(PORT, () => {
  console.log(`SkillChain backend listening on http://localhost:${PORT}`);
});

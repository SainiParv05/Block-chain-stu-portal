import CryptoJS from "crypto-js";

export function decryptAESHex(encryptedObj: { iv: string; data: string }, secret: string) {
  // secret should be plain 32 char hex/UTF-8 string
  const iv = CryptoJS.enc.Hex.parse(encryptedObj.iv);
  const cipherHex = CryptoJS.enc.Hex.parse(encryptedObj.data);

  // Build cipher params object (CryptoJS expects base64/cipher params)
  const cipherParams = CryptoJS.lib.CipherParams.create({
    ciphertext: cipherHex
  });

  const key = CryptoJS.enc.Utf8.parse(secret);

  const decrypted = CryptoJS.AES.decrypt(cipherParams, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });

  const text = decrypted.toString(CryptoJS.enc.Utf8);
  return text;
}

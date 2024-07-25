const {
  V4: { generateKey },
} = require("paseto");

interface Keys {
  publicKey: string;
  secretKey: string;
}

const keys = global as unknown as Keys;

export function setKeys(publicKey: string, secretKey: string) {
  keys.publicKey = publicKey;
  keys.secretKey = secretKey;
}

export function getPublicKey() {
  return keys.publicKey ?? null;
}

export function getSecretKey() {
  return keys.secretKey ?? null;
}

export async function initializeKeys() {
  const key = await generateKey("public", { format: "paserk" });
  setKeys(key.publicKey, key.secretKey);
}

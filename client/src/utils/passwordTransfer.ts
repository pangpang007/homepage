function decodeBase64Url(input: string): Uint8Array {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  const binary = atob(padded);
  const out = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    out[i] = binary.charCodeAt(i);
  }
  return out;
}

function encodeBase64Url(input: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < input.length; i += 1) {
    binary += String.fromCharCode(input[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export async function encryptPasswordForTransport(
  plainPassword: string,
  transferKeyB64Url: string
): Promise<string> {
  if (!transferKeyB64Url) {
    throw new Error("缺少 VITE_PASSWORD_TRANSFER_KEY 配置");
  }
  const keyBytes = decodeBase64Url(transferKeyB64Url);
  if (keyBytes.length !== 32) {
    throw new Error("VITE_PASSWORD_TRANSFER_KEY 解码后必须是 32 字节");
  }

  const key = await crypto.subtle.importKey(
    "raw",
    keyBytes,
    { name: "AES-GCM" },
    false,
    ["encrypt"]
  );

  const nonce = crypto.getRandomValues(new Uint8Array(12));
  const plainBytes = new TextEncoder().encode(plainPassword);
  const cipherBuffer = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: nonce },
    key,
    plainBytes
  );
  const cipher = new Uint8Array(cipherBuffer);

  return `v1.${encodeBase64Url(nonce)}.${encodeBase64Url(cipher)}`;
}

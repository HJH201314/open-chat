export async function encryptWithPublicKey(publicKeyPem: string, data: string): Promise<string> {
  // 导入公钥
  const publicKey = await window.crypto.subtle.importKey(
    'spki',
    pemToArrayBuffer(publicKeyPem),
    { name: 'RSA-OAEP', hash: 'SHA-256' },
    false,
    ['encrypt']
  );

  // 加密数据
  const encrypted = await window.crypto.subtle.encrypt(
    { name: 'RSA-OAEP' },
    publicKey,
    new TextEncoder().encode(data)
  );

  // 转换为 Base64
  return arrayBufferToBase64(encrypted);
}

// 辅助函数：PEM 格式转换为 ArrayBuffer
function pemToArrayBuffer(pem: string): ArrayBuffer {
  const base64 = pem.replace(/-+(BEGIN|END) PUBLIC KEY-+/g, '');
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

// 辅助函数：ArrayBuffer 转换为 Base64
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

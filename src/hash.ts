import { createHash } from 'node:crypto';

export function doubleSha256(data: Buffer): Buffer {
  return createHash('sha256').update(createHash('sha256').update(data).digest()).digest();
}

export function hash160(data: Buffer): Buffer {
  const sha256 = createHash('sha256').update(data).digest();
  return createHash('ripemd160').update(sha256).digest();
}

export function toHex(buf: Buffer): string {
  return buf.toString('hex').toLowerCase();
}

export function fromHex(hex: string): Buffer {
  return Buffer.from(hex, 'hex');
}

export function reverseHex(hex: string): string {
  if (hex.length % 2 !== 0) {
    throw new Error('Hex string must have an even length');
  }
  let reversed = '';
  for (let i = hex.length - 2; i >= 0; i -= 2) {
    reversed += hex.substring(i, i + 2);
  }
  return reversed.toLowerCase();
}

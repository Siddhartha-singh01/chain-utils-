import { expect, test } from 'vitest';
import { doubleSha256, hash160, toHex, fromHex, reverseHex } from '../src/hash.js';

test('doubleSha256 of empty buffer', () => {
  const empty = Buffer.alloc(0);
  const hash = doubleSha256(empty);
  expect(toHex(hash)).toBe('5df6e0e2761359d30a8275058e299fcc0381534545f55cf43e41983f5d4c9456');
});

test('reverseHex', () => {
  expect(reverseHex('0100')).toBe('0001');
  expect(reverseHex('aabbccdd')).toBe('ddccbbaa');
  expect(() => reverseHex('123')).toThrow();
});

test('toHex and fromHex round-trip', () => {
  const originalHex = 'deadbeef1234';
  const buf = fromHex(originalHex);
  const back = toHex(buf);
  expect(back).toBe(originalHex);
});

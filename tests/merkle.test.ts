import { expect, test } from 'vitest';
import { computeMerkleRoot } from '../src/merkle.js';

test('single txid returns itself', () => {
  const txid = '362fac272e271edb2d86a43d9b4317fdb57be16d1ba49c3ce3b44bdea0e6d628';
  expect(computeMerkleRoot([txid])).toBe(txid);
});

test('empty array throws an error', () => {
  expect(() => computeMerkleRoot([])).toThrow();
});

test('two known txids produce correct merkle root', () => {
  // block 170 mainnet txids
  const tx1 = 'f4184fc596403b9d638783cf57adfe4c75c605f6356fbc91338530e9831e9e16';
  const tx2 = 'a1075be556d7ce1ce41c0eb7042a3eb17bdcc045d471b05dfbd4c6d04ddb98a8';
  const expectedRoot = '09b0eb48c4792b7d8e78fe12b5e2ac5ebc0b67cb38a94ce487edc657628c2ba5';
  
  expect(computeMerkleRoot([tx1, tx2])).toBe(expectedRoot);
});

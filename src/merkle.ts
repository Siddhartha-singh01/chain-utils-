import { doubleSha256, fromHex, toHex, reverseHex } from './hash.js';

export function computeMerkleRoot(txids: string[]): string {
  if (txids.length === 0) {
    throw new Error('Empty array');
  }
  if (txids.length === 1) {
    return txids[0];
  }

  let level = txids.map((txid) => fromHex(reverseHex(txid)));

  while (level.length > 1) {
    const nextLevel: Buffer[] = [];
    for (let i = 0; i < level.length; i += 2) {
      const left = level[i];
      const right = i + 1 < level.length ? level[i + 1] : left;
      nextLevel.push(doubleSha256(Buffer.concat([left, right])));
    }
    level = nextLevel;
  }

  return reverseHex(toHex(level[0]));
}

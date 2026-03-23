# chain-utils

Zero-dependency Bitcoin primitives for Node.js.

I built this because I needed a fast, low-level way to parse raw Bitcoin data for my Chain Lens Bitcoin analyzer project. I didn't want to pull in massive cryptographic libraries just to decode varints or slice up transactions.

Requires Node 18+ (uses built-in `crypto` for everything).

## Install

```bash
npm install chain-utils
```

## Usage

### Transaction Parsing

Decode raw hex into structured JS objects. Supports legacy and segwit formats.

```ts
import { parseTx } from 'chain-utils';

const hex = "0100000001...";
const tx = parseTx(hex);

console.log(tx.isCoinbase); // true
console.log(tx.outputs[0].value); // 5000000000n
```

### Merkle Trees

Compute a block's Merkle root from a list of transaction IDs (in natural display order).

```ts
import { computeMerkleRoot } from 'chain-utils';

const txids = [
  'f4184fc596403b9d638783cf57adfe4c75c605f6356fbc91338530e9831e9e16',
  'a1075be556d7ce1ce41c0eb7042a3eb17bdcc045d471b05dfbd4c6d04ddb98a8'
];

const root = computeMerkleRoot(txids);
console.log(root); // '09b0eb48c...'
```

### Varints

Read and write variable-length integers (commonly used in P2P protocols).

```ts
import { readVarint, writeVarint } from 'chain-utils';

const buf = Buffer.from('fd2002', 'hex');
const { value, size } = readVarint(buf, 0);

console.log(value); // 544
console.log(size); // 3

const encoded = writeVarint(544);
```

### Hashing Constants

Quick wrappers around Node's `crypto` for standard Bitcoin operations.

```ts
import { doubleSha256, hash160, toHex, fromHex, reverseHex } from 'chain-utils';

const data = Buffer.from('hello');
const hash = doubleSha256(data); // sha256(sha256(data))
const pubkeyHash = hash160(data); // ripemd160(sha256(data))

const stringHex = toHex(hash);
```

# chain-utils-

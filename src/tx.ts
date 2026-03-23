import { readVarint } from './varint.js';
import { reverseHex, toHex, doubleSha256 } from './hash.js';
import type { Transaction, TxInput, TxOutput } from './types.js';

export function parseTx(hexOrBuffer: string | Buffer): Transaction {
  const buf = Buffer.isBuffer(hexOrBuffer) ? hexOrBuffer : Buffer.from(hexOrBuffer, 'hex');
  let offset = 0;

  const version = buf.readInt32LE(offset);
  offset += 4;

  let isSegwit = false;
  if (buf.length > offset + 1 && buf[offset] === 0x00 && buf[offset + 1] === 0x01) {
    isSegwit = true;
    offset += 2;
  }

  const inputsStart = offset;

  const inputVarint = readVarint(buf, offset);
  const inputCount = inputVarint.value;
  offset += inputVarint.size;

  const inputs: TxInput[] = [];
  let isCoinbase = false;

  for (let i = 0; i < inputCount; i++) {
    const txidBuf = buf.subarray(offset, offset + 32);
    offset += 32;
    const txid = reverseHex(toHex(txidBuf));
    const vout = buf.readUInt32LE(offset);
    offset += 4;

    if (txid === '0000000000000000000000000000000000000000000000000000000000000000' && vout === 0xffffffff) {
      isCoinbase = true;
    }

    const scriptVarint = readVarint(buf, offset);
    const scriptSigSize = scriptVarint.value;
    offset += scriptVarint.size;

    const scriptSig = toHex(buf.subarray(offset, offset + scriptSigSize));
    offset += scriptSigSize;

    const sequence = buf.readUInt32LE(offset);
    offset += 4;

    inputs.push({ txid, vout, scriptSigSize, scriptSig, sequence });
  }

  const outputVarint = readVarint(buf, offset);
  const outputCount = outputVarint.value;
  offset += outputVarint.size;

  const outputs: TxOutput[] = [];
  for (let i = 0; i < outputCount; i++) {
    const value = buf.readBigInt64LE(offset);
    offset += 8;

    const scriptVarint = readVarint(buf, offset);
    const scriptPubKeySize = scriptVarint.value;
    offset += scriptVarint.size;

    const scriptPubKey = toHex(buf.subarray(offset, offset + scriptPubKeySize));
    offset += scriptPubKeySize;

    outputs.push({ value, scriptPubKeySize, scriptPubKey });
  }

  const outputsEnd = offset;

  if (isSegwit) {
    for (let i = 0; i < inputCount; i++) {
      const witnessCountVarint = readVarint(buf, offset);
      const witnessCount = witnessCountVarint.value;
      offset += witnessCountVarint.size;

      for (let j = 0; j < witnessCount; j++) {
        const itemVarint = readVarint(buf, offset);
        const itemSize = itemVarint.value;
        offset += itemVarint.size;
        offset += itemSize;
      }
    }
  }

  const locktime = buf.readUInt32LE(offset);
  offset += 4;

  let txidBufForHash: Buffer;
  if (isSegwit) {
    txidBufForHash = Buffer.concat([
      buf.subarray(0, 4),
      buf.subarray(inputsStart, outputsEnd),
      buf.subarray(offset - 4, offset),
    ]);
  } else {
    txidBufForHash = buf.subarray(0, offset);
  }

  const txidBytes = doubleSha256(txidBufForHash);
  const txidStr = reverseHex(toHex(txidBytes));

  return {
    txid: txidStr,
    version,
    inputs,
    outputs,
    locktime,
    size: buf.length,
    isCoinbase,
  };
}

import { expect, test } from 'vitest';
import { readVarint, writeVarint } from '../src/varint.js';

test('readVarint examples', () => {
  const buf1 = Buffer.from('fd2002', 'hex');
  const res1 = readVarint(buf1, 0);
  expect(res1).toEqual({ value: 544, size: 3 });

  const buf2 = Buffer.from('fc', 'hex');
  const res2 = readVarint(buf2, 0);
  expect(res2).toEqual({ value: 252, size: 1 });
});

test('writeVarint and readVarint round-trip', () => {
  const values = [0, 1, 252, 253, 544, 65535, 65536, 4000000000];
  
  for (const val of values) {
    const buf = writeVarint(val);
    const { value, size } = readVarint(buf, 0);
    expect(value).toBe(val);
    expect(size).toBe(buf.length);
  }
});

export function readVarint(buf: Buffer, offset: number): { value: number; size: number } {
  if (offset >= buf.length) {
    throw new Error('Offset out of bounds');
  }
  const first = buf[offset];
  if (first < 0xfd) {
    return { value: first, size: 1 };
  } else if (first === 0xfd) {
    return { value: buf.readUInt16LE(offset + 1), size: 3 };
  } else if (first === 0xfe) {
    return { value: buf.readUInt32LE(offset + 1), size: 5 };
  } else {
    return { value: Number(buf.readBigUInt64LE(offset + 1)), size: 9 };
  }
}

export function writeVarint(value: number): Buffer {
  if (value < 0xfd) {
    const buf = Buffer.alloc(1);
    buf[0] = value;
    return buf;
  } else if (value <= 0xffff) {
    const buf = Buffer.alloc(3);
    buf[0] = 0xfd;
    buf.writeUInt16LE(value, 1);
    return buf;
  } else if (value <= 0xffffffff) {
    const buf = Buffer.alloc(5);
    buf[0] = 0xfe;
    buf.writeUInt32LE(value, 1);
    return buf;
  } else {
    const buf = Buffer.alloc(9);
    buf[0] = 0xff;
    buf.writeBigUInt64LE(BigInt(value), 1);
    return buf;
  }
}

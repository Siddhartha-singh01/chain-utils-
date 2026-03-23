export interface TxInput {
  txid: string;
  vout: number;
  scriptSigSize: number;
  scriptSig: string;
  sequence: number;
}

export interface TxOutput {
  value: bigint;
  scriptPubKeySize: number;
  scriptPubKey: string;
}

export interface Transaction {
  txid: string;
  version: number;
  inputs: TxInput[];
  outputs: TxOutput[];
  locktime: number;
  size: number;
  isCoinbase: boolean;
}

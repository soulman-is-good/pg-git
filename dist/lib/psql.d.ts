/// <reference types="node" />
import { Writable } from 'stream';
import { PGOptions } from './pgOptions';
declare type TransactionCallback = (transaction: Transaction) => void;
declare type ErrorCallback = (error: Error) => void;
declare const _default: (pgOptions: PGOptions, callback: TransactionCallback) => Promise<unknown>;
export default _default;
declare class Transaction extends Writable {
    stdin: Writable;
    started: boolean;
    constructor(stdin: Writable);
    begin(): void;
    end(): void;
    _write(data: Buffer, encoding: string, callback: ErrorCallback): void;
}

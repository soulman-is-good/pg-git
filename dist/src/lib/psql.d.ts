/// <reference types="node" />
import { Writable, Stream } from 'stream';
import { PGOptions } from './pgOptions';
declare type TransactionCallback = (transaction: Transaction) => void;
declare type ErrorCallback = (error: Error) => void;
declare const _default: (pgOptions: PGOptions, callback: TransactionCallback, returnResult?: boolean) => Promise<string | undefined>;
export default _default;
declare class Transaction extends Writable {
    stdin: Writable;
    started: boolean;
    constructor(stdin: Writable);
    begin(): void;
    finish(): void;
    pipeFrom(rs: Stream): void;
    _write(data: Buffer, encoding: string, callback: ErrorCallback): void;
}

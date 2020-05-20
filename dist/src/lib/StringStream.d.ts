/// <reference types="node" />
import { Duplex, DuplexOptions } from 'stream';
export declare class StringStream extends Duplex {
    private _string;
    private _lastReadBype;
    constructor(str?: string, opts?: DuplexOptions);
    _write(chunk: Buffer | string, _encoding: string, callback: (err?: Error) => void): void;
    _read(size: number): void;
    _final(callback: (err?: Error) => void): void;
    toString(): string;
}

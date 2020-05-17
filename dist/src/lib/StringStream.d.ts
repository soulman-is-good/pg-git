/// <reference types="node" />
import { Readable } from 'stream';
export declare class StringStream extends Readable {
    private _string;
    private _lastReadBype;
    constructor(str: string);
    _read(size: number): void;
}

/// <reference types="node" />
import { Transform } from 'stream';
export declare class Pipe extends Transform {
    _transform(chunk: Buffer, enc: string, callback: Function): void;
}

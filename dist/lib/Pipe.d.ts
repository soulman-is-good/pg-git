/// <reference types="node" />
import { Transform, TransformCallback, TransformOptions } from 'stream';
declare type PipeOptions = Omit<TransformOptions, 'read' | 'write' | 'writev' | 'final' | 'destroy' | 'flush' | 'transform'>;
export declare class Pipe extends Transform {
    constructor(opts?: PipeOptions);
    _transform(chunk: Buffer | string, enc: string, callback: TransformCallback): void;
}
export {};

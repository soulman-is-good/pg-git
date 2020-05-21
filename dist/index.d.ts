/// <reference types="node" />
import { Stream } from 'stream';
import { Pipe } from './lib/Pipe';
import { StringStream } from './lib/StringStream';
import { PGOptions } from './lib/pgOptions';
export declare const dump: (options: Partial<PGOptions>) => Promise<import("stream").Duplex>;
export declare const diff: (src: Stream, dest: Stream) => Promise<Stream>;
export declare const apply: (options: Partial<PGOptions>, stringOrStream: Stream | string, returnResult?: boolean) => Promise<string | undefined>;
export { PGOptions, StringStream, Pipe };

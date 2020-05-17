import { Stream } from 'stream';
import { PGOptions } from './pgOptions';
declare const _default: (pgOptions: PGOptions, oldSqlStream: Stream, newSqlStream: Stream) => Promise<Stream>;
export default _default;

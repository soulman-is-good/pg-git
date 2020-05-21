import { PGOptions } from './pgOptions';
declare type PGExecutable = 'pg_dump' | 'psql';
declare const _default: (bin: PGExecutable, pgOptions: PGOptions) => Promise<string>;
export default _default;

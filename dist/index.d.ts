import { PGOptions } from './lib/pgOptions';
export declare const pgGit: {
    dump(options: Partial<PGOptions>): Promise<unknown>;
    diff(src: any, dest: any): any;
    apply(stringStream: any): Promise<unknown>;
};
export { PGOptions };

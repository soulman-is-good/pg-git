export interface PGOptions {
    user: string;
    password: string;
    database: string;
    host: string;
    port: number;
    pgVersion: string;
    noDownload: boolean;
    pgDumpPath?: string;
    psqlPath?: string;
}
export declare const pgOptions: PGOptions;

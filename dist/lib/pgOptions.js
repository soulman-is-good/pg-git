"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPGOptions = void 0;
exports.getPGOptions = (options) => Object.assign({
    user: process.env.PGUSER || 'postgres',
    password: process.env.PGPASSWORD || 'postgres',
    database: process.env.PGDATABASE || 'postgres',
    host: process.env.PGHOST || 'localhost',
    port: parseInt(process.env.PGPORT, 10) || 5432,
    /**
     * Postgres binaries version to retrieve
     */
    pgVersion: process.env.PGVERSION,
    /**
     * If this option is set to false
     * it will download postgres binaries to your home folder
     * Else it will try to use psql and pg_dump already installed
     */
    noDownload: !!process.env.NO_DOWNLOAD || false,
    pgDumpPath: process.env.PG_DUMP_PATH,
    psqlPath: process.env.PSQL_PATH,
}, options);
//# sourceMappingURL=pgOptions.js.map
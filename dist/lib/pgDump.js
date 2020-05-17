"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const Pipe_1 = require("./Pipe");
const resolvePgBin_1 = __importDefault(require("./resolvePgBin"));
exports.default = (pgOptions) => {
    const ws = new Pipe_1.Pipe();
    return resolvePgBin_1.default('pg_dump', pgOptions).then(bin => new Promise(resolve => {
        process.env.PGPASSWORD = pgOptions.password;
        const options = [
            '-s',
            '-O',
            '--host',
            pgOptions.host,
            '--port',
            pgOptions.port.toString(),
            '--username',
            pgOptions.user,
            '--dbname',
            pgOptions.database,
        ];
        const pgDump = child_process_1.spawn(bin, options);
        delete process.env.PGPASSWORD;
        pgDump.on('error', onError);
        pgDump.stderr.on('data', onError);
        pgDump.stdout.pipe(ws);
        resolve(ws);
        function onError(chunk) {
            ws.emit('error', chunk instanceof Error ? chunk.message : chunk);
            ws.end();
        }
    }));
};
//# sourceMappingURL=pgDump.js.map
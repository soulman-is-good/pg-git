"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const stream_1 = require("stream");
const child_process_1 = require("child_process");
const log4js_1 = __importDefault(require("log4js"));
const resolvePgBin_1 = __importDefault(require("./resolvePgBin"));
const log = log4js_1.default.getLogger('pggit');
exports.default = (pgOptions, callback) => {
    if ('function' !== typeof callback) {
        throw new Error('callback should be a function');
    }
    const options = [
        '--host',
        pgOptions.host,
        '--port',
        pgOptions.port.toString(),
        '--username',
        pgOptions.user,
        pgOptions.database,
    ];
    return resolvePgBin_1.default('psql', pgOptions).then(bin => new Promise((resolve, reject) => {
        process.env.PGPASSWORD = pgOptions.password;
        const psql = child_process_1.spawn(bin, options);
        const transaction = new Transaction(psql.stdin);
        delete process.env.PGPASSWORD;
        psql.on('error', onError);
        psql.stderr.once('data', onError);
        psql.stdout.on('data', onData);
        callback(transaction);
        function onError(chunk) {
            reject(new Error(chunk instanceof Error ? chunk.message : chunk.toString()));
            psql.kill();
        }
        function onData(chunk) {
            const msg = chunk.toString();
            log.debug(msg);
            if (msg.indexOf('COMMIT') > -1) {
                resolve();
                psql.kill();
            }
        }
    }));
};
class Transaction extends stream_1.Writable {
    constructor(stdin) {
        super();
        this.stdin = stdin;
        this.started = false;
    }
    begin() {
        if (!this.started) {
            this.stdin.write('BEGIN;\n');
            this.started = true;
        }
    }
    end() {
        if (this.started) {
            this.stdin.write('COMMIT;\nq');
            this.started = false;
        }
    }
    // pipe(rs) {
    //   rs.on('data', chunk => this.write(chunk));
    //   rs.on('error', err => this.write(err.message));
    //   rs.on('end', () => this.end());
    // }
    _write(data, encoding, callback) {
        if (!this.started)
            this.begin();
        this.stdin.write(data, encoding, callback);
    }
}
//# sourceMappingURL=psql.js.map
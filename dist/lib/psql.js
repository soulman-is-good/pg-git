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
exports.default = (pgOptions, callback, returnResult = false) => {
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
        const env = Object.assign({}, process.env, { PGPASSWORD: pgOptions.password });
        const psql = child_process_1.spawn(bin, options, { env });
        const transaction = new Transaction(psql.stdin);
        let result = '';
        psql.on('error', onError);
        psql.stderr.once('data', onError);
        psql.stdout.on('data', onData);
        transaction.on('error', onError);
        callback(transaction);
        function onError(chunk) {
            reject(new Error(chunk instanceof Error ? chunk.message : chunk.toString()));
            psql.kill();
        }
        function onData(chunk) {
            const msg = chunk.toString();
            log.debug(msg);
            if (returnResult && !/BEGIN|COMMIT/.test(msg)) {
                result += msg;
            }
            if (msg.indexOf('COMMIT') > -1) {
                resolve(returnResult && result ? result : undefined);
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
        this.stdin.on('error', err => {
            this.started = false;
            this.emit('error', err);
        });
    }
    begin() {
        if (!this.started) {
            this.stdin.write('BEGIN;\n');
            this.started = true;
        }
    }
    finish() {
        if (this.started) {
            // eslint-disable-next-line prettier/prettier
            this.stdin.write('COMMIT;\n\q');
            this.started = false;
        }
    }
    pipeFrom(rs) {
        this.begin();
        rs.pipe(this.stdin, { end: false });
        rs.on('end', () => this.finish());
    }
    _write(data, encoding, callback) {
        if (!this.started)
            this.begin();
        this.stdin.write(data, encoding, callback);
    }
}
//# sourceMappingURL=psql.js.map
import { Writable, Stream } from 'stream';
import { spawn } from 'child_process';
import log4js from 'log4js';
import { PGOptions } from './pgOptions';
import resolveBin from './resolvePgBin';

type TransactionCallback = (transaction: Transaction) => void;
type ErrorCallback = (error: Error) => void;
const log = log4js.getLogger('pggit');

export default (
  pgOptions: PGOptions,
  callback: TransactionCallback,
  returnResult = false,
): Promise<string | undefined> => {
  const options = [
    '--host',
    pgOptions.host,
    '--port',
    pgOptions.port.toString(),
    '--username',
    pgOptions.user,
    pgOptions.database,
  ];

  return resolveBin('psql', pgOptions).then(
    bin =>
      new Promise((resolve, reject) => {
        const env = Object.assign({}, process.env, { PGPASSWORD: pgOptions.password });
        const psql = spawn(bin, options, { env });
        const transaction = new Transaction(psql.stdin);
        let result = '';

        psql.on('error', onError);
        psql.stderr.once('data', onError);
        psql.stdout.on('data', onData);

        callback(transaction);

        function onError(chunk: Error | Buffer) {
          reject(new Error(chunk instanceof Error ? chunk.message : chunk.toString()));
          psql.kill();
        }

        function onData(chunk: Buffer) {
          const msg = chunk.toString();

          log.debug(msg);
          if (returnResult) {
            result += msg;
          }
          if (msg.indexOf('COMMIT') > -1) {
            resolve(returnResult ? result : undefined);
            psql.kill();
          }
        }
      }),
  );
};

class Transaction extends Writable {
  stdin: Writable;
  started: boolean;

  constructor(stdin: Writable) {
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

  finish() {
    if (this.started) {
      // eslint-disable-next-line prettier/prettier
      this.stdin.write('COMMIT;\n\q');
      this.started = false;
    }
  }

  pipeFrom(rs: Stream) {
    this.begin();
    rs.pipe(this.stdin, { end: false });
    rs.on('end', () => this.finish());
  }

  _write(data: Buffer, encoding: string, callback: ErrorCallback) {
    if (!this.started) this.begin();
    this.stdin.write(data, encoding, callback);
  }
}

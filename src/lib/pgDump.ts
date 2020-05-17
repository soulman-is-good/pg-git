import { spawn } from 'child_process';
import { Duplex } from 'stream';
import { Pipe } from './Pipe';
import { PGOptions } from './pgOptions';
import resolveBin from './resolvePgBin';

export default (pgOptions: PGOptions): Promise<Duplex> => {
  const ws = new Pipe();

  return resolveBin('pg_dump', pgOptions).then(
    bin =>
      new Promise(resolve => {
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
        const env = Object.assign({}, process.env, { PGPASSWORD: pgOptions.password });
        const pgDump = spawn(bin, options, { env });

        pgDump.on('error', onError);
        pgDump.stderr.on('data', onError);
        pgDump.stdout.pipe(ws);

        resolve(ws);

        function onError(chunk: Error | Buffer) {
          console.log(chunk instanceof Error ? null : chunk.toString());
          ws.emit('error', chunk instanceof Error ? chunk.message : chunk);
          ws.end();
        }
      }),
  );
};

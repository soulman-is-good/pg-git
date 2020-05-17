import { Stream } from 'stream';
import diff from './diff';
import psql from './psql';
import pgDump from './pgDump';
import { PGOptions } from './pgOptions';

export default (pgOptions: PGOptions, newSql: Stream, justPrintDiff: boolean) => {
  return pgDump(pgOptions)
    .then(oldDump => {
      return diff(pgOptions, oldDump, newSql);
    })
    .then(
      diffStr =>
        new Promise((resolve, reject) => {
          if (justPrintDiff) {
            diffStr.on('error', reject);
            diffStr.pipe(process.stdout);
            diffStr.on('close', () => resolve());
          } else {
            psql(pgOptions, transaction => {
              diffStr.pipe(transaction);
            })
              .then(resolve)
              .catch(reject);
          }
        }),
    );
};

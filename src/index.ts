import { Stream } from 'stream';
import setupLog4js from './lib/setupLog4js';
import pgDump from './lib/pgDump';
import pgDiff from './lib/diff';
import psql from './lib/psql';
import { Pipe } from './lib/Pipe';
import { StringStream } from './lib/StringStream';
import { PGOptions, pgOptions } from './lib/pgOptions';

setupLog4js();

export const dump = (options: Partial<PGOptions>) => pgDump(Object.assign(pgOptions, options));

export const diff = (options: Partial<PGOptions>, src: Stream, dest: Stream) =>
  pgDiff(Object.assign(pgOptions, options), src, dest);

export const apply = (
  options: Partial<PGOptions>,
  stringOrStream: Stream | string,
  returnResult = false,
): Promise<string | undefined> => {
  const stream = stringOrStream instanceof Stream ? stringOrStream : new StringStream(`${stringOrStream}\n`);

  return psql(Object.assign(pgOptions, options), transation => transation.pipeFrom(stream), returnResult);
};

export { PGOptions, StringStream, Pipe };

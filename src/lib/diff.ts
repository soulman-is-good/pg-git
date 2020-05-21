import path from 'path';
import fs from 'fs';
import { spawn } from 'child_process';
import { Stream } from 'stream';
import log4js from 'log4js';
import { Pipe } from './Pipe';

const log = log4js.getLogger('pggit');
const waitForClose = (stream: Stream) => new Promise(resolve => stream.on('close', resolve));

export default (oldSqlStream: Stream, newSqlStream: Stream): Promise<Stream> => {
  const java = process.env.JAVA_HOME ? path.join(process.env.JAVA_HOME, 'bin', 'java') : 'java';
  const jar = path.join(__dirname, '..', '..', 'bin', 'apgdiff.jar');
  const tmpFolder = fs.mkdtempSync('pg-git');
  const oldFile = path.resolve(tmpFolder, 'old.sql');
  const newFile = path.resolve(tmpFolder, 'new.sql');

  log.info(`Creating diff...`);
  const oldStr = fs.createWriteStream(oldFile);
  const newStr = fs.createWriteStream(newFile);
  const outDiff = new Pipe();

  oldSqlStream.pipe(oldStr);
  newSqlStream.pipe(newStr);

  return Promise.all([waitForClose(newStr), waitForClose(oldStr)]).then(
    () =>
      new Promise(resolve => {
        const apgdiff = spawn(java, ['-jar', jar, oldFile, newFile]);

        apgdiff.on('error', onError);
        apgdiff.on('close', onClose);
        apgdiff.stderr.on('data', onError);
        apgdiff.stdout.pipe(outDiff);

        resolve(outDiff);

        function onClose() {
          fs.unlinkSync(oldFile);
          fs.unlinkSync(newFile);
          fs.rmdirSync(tmpFolder, { recursive: true });
        }

        function onError(chunk: Error | Buffer) {
          fs.unlinkSync(oldFile);
          fs.unlinkSync(newFile);
          fs.rmdirSync(tmpFolder, { recursive: true });
          outDiff.emit('error', chunk instanceof Error ? chunk.message : chunk);
          outDiff.end();
        }
      }),
  );
};

'use strict';

const os = require('os');
const path = require('path');
const WriteStream = require('fs').WriteStream;
const spawn = require('child_process').spawn;

module.exports = function(options, ws) {
  const arch = `${os.platform()}-${os.arch()}`;
  const bin = path.join(__dirname, '..', 'bin', arch, 'bin', 'pg_dump');

  if (options instanceof WriteStream) {
    ws = options;
    options = [];
  }

  return new Promise((resolve, reject) => {
    const pg_dump = spawn(bin, ['-s', '-O'].concat(options));
    let hadErrors = false;
    pg_dump.on('error', reject);
    pg_dump.on('close', onClose);
    pg_dump.stderr.on('data', onError);
    pg_dump.stdout.pipe(ws);

    function onClose() {
      if (!hadErrors) {
        resolve('DONE!');
      }
    }

    function onError(chunk) {
      hadErrors = true;
      reject(new Error(chunk.toString()));
    }
  });
};

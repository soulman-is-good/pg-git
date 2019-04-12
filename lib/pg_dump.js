'use strict';

const WriteStream = require('fs').WriteStream;
const spawn = require('child_process').spawn;
const resolveBin = require('./resolvePgBin');

module.exports = function(options, ws) {
  if (options instanceof WriteStream) {
    ws = options;
    options = [];
  }

  return resolveBin('pg_dump').then(bin => new Promise((resolve, reject) => {
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
  }));
};

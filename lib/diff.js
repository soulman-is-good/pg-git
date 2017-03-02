'use strict';

const os = require('os');
const path = require('path');
const spawn = require('child_process').spawn;

module.exports = function(old_sql, new_sql, ws) {
  const java = process.env.JAVA_HOME
    ? path.join(process.env.JAVA_HOME, 'bin', 'java')
    : 'java';
  const jar = path.join(__dirname, '..', 'bin', 'apgdiff-2.4.jar');

  return new Promise((resolve, reject) => {
    const apgdiff = spawn(java, ['-jar', jar, old_sql, new_sql]);
    let hadErrors = false;
    apgdiff.on('error', reject);
    apgdiff.on('close', onClose);
    apgdiff.stderr.on('data', onError);
    apgdiff.stdout.pipe(ws);

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

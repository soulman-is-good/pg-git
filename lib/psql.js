'use strict';

const os = require('os');
const path = require('path');
const spawn = require('child_process').spawn;

module.exports = function(options, callback) {
  const arch = `${os.platform()}-${os.arch()}`;
  const bin = path.join(__dirname, '..', 'bin', arch, 'bin', 'psql');

  if ('function' === typeof options) {
    callback = options;
    options = [];
  }

  return new Promise((resolve, reject) => {
    const psql = spawn(bin, options);
    const transaction = new Transaction(psql.stdin);
    psql.on('error', reject);
    psql.stderr.once('data', onError);
    psql.stdout.on('data', onData);

    callback(transaction);

    function onError(chunk) {
      reject(new Error(chunk.toString()));
      psql.kill();
    }

    function onData(chunk) {
      console.log(chunk.toString());
      if (chunk.toString().indexOf('COMMIT') > -1) {
        resolve();
        psql.kill();
      }
    }
  });
};

class Transaction {
  constructor(stdin) {
    this.stdin = stdin;
    this.started = false;
  }

  begin () {
    if (!this.started) {
      this.stdin.write('BEGIN;\n');
      this.started = true;
    }
  }

  end () {
    if (this.started) {
      this.stdin.write('COMMIT;\n\q');
      this.started = false;
    }
  }

  pipe(rs) {
    rs.on('data', chunk => this.write(chunk));
    rs.on('error', err => this.write(err.message));
    rs.on('end', () => this.end());
  }

  write (data) {
    if (!this.started) this.begin();
    this.stdin.write(data);
  }

}

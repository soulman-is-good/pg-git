const fs = require('fs');
const os = require('os');
const path = require('path');
const diff = require('./diff');
const psql = require('./psql');
const pg_dump = require('./pg_dump');
const OLD_DUMP = path.join(os.tmpdir(), 'old.dump.sql');

module.exports = function(DUMP_FILE) {
  if (!fs.existsSync(DUMP_FILE)) {
    return new Promise((r, reject) => reject(new Error('No migrations made yet. Run `commit` to create one')));
  }
  const time = Date.now();
  const ws = fs.createWriteStream(OLD_DUMP);
  const filename = Date.now().toString('16') + '.sql';
  const MIGRATION_FILE = path.join(os.tmpdir(), filename);
  return pg_dump(ws)
    .then(ok => {
      const ws = fs.createWriteStream(MIGRATION_FILE);
      return diff(OLD_DUMP, DUMP_FILE, ws);
    })
    .then(ok => {
      const stats = fs.statSync(MIGRATION_FILE);
      if (stats.size === 0) {
        throw new Error('Up to date');
      } 
      return applySql(MIGRATION_FILE);
    })
    .then(() => {
      cleanUp([OLD_DUMP, MIGRATION_FILE]);
      return 'SUCCESS!';
    })
    .catch(err => {
      cleanUp([OLD_DUMP, MIGRATION_FILE]);
      return err;
    });
};

function cleanUp(files) {
  files.forEach((file) => {
    fs.existsSync(file) && fs.unlinkSync(file);
  });
}

function applySql(file) {
  return new Promise((resolve, reject) => {
    const rs = fs.createReadStream(file, { encoding: 'utf8' });
    psql(transaction => {
      transaction.pipe(rs);
    })
    .then(resolve)
    .catch(reject);
  });
}
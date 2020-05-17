const fs = require('fs');
const os = require('os');
const path = require('path');
const diff = require('./diff');
const psql = require('./psql');
const Pipe = require('./Pipe');
const pg_dump = require('./pg_dump');
const OLD_DUMP = path.join(os.tmpdir(), 'old.dump.sql');
module.exports = function (newSql, justPrintDiff) {
    const out = new Pipe();
    return pg_dump()
        .then(oldDump => {
        return diff(oldDump, newSql, out);
    });
};
function cleanUp(files) {
    files.forEach((file) => {
        fs.existsSync(file) && fs.unlinkSync(file);
    });
}
function applySql(file, justPrintDiff) {
    return new Promise((resolve, reject) => {
        const rs = fs.createReadStream(file, { encoding: 'utf8' });
        rs.on('error', reject);
        if (justPrintDiff) {
            rs.pipe(process.stdout);
            rs.on('close', () => resolve());
        }
        else {
            psql(transaction => {
                transaction.pipe(rs);
            })
                .then(resolve)
                .catch(reject);
        }
    });
}
//# sourceMappingURL=migrate.js.map
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const log = require('log4js').getLogger('pggit');
const Pipe = require('./Pipe');
const waitForClose = stream => new Promise(resolve => stream.on('close', resolve));
module.exports = function (old_sql, new_sql) {
    const java = process.env.JAVA_HOME
        ? path.join(process.env.JAVA_HOME, 'bin', 'java')
        : 'java';
    const jar = path.join(__dirname, '..', 'bin', 'apgdiff.jar');
    const tmpFolder = fs.mkdtempSync('pg-git');
    const oldFile = path.resolve(tmpFolder, 'old.sql');
    const newFile = path.resolve(tmpFolder, 'new.sql');
    log.info(`Creating diff...`);
    const oldStr = fs.createWriteStream(oldFile);
    const newStr = fs.createWriteStream(newFile);
    const outDiff = new Pipe();
    old_sql.pipe(oldStr);
    new_sql.pipe(newStr);
    return Promise.all([
        waitForClose(newStr),
        waitForClose(oldStr),
    ])
        .then(() => new Promise((resolve, reject) => {
        const apgdiff = spawn(java, ['-jar', jar, oldFile, newFile]);
        let hadErrors = false;
        apgdiff.on('error', onError);
        apgdiff.on('close', onClose);
        apgdiff.stderr.on('data', onError);
        apgdiff.stdout.pipe(outDiff);
        resolve(outDiff);
        function onClose() {
            fs.rmdirSync(tmpFolder, { recursive: true });
            if (!hadErrors) {
                resolve('DONE!');
            }
        }
        function onError(chunk) {
            fs.rmdirSync(tmpFolder, { recursive: true });
            hadErrors = true;
            reject(new Error(String(chunk)));
        }
    }));
};
//# sourceMappingURL=diff.js.map
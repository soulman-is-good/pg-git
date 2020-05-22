"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const child_process_1 = require("child_process");
const log4js_1 = __importDefault(require("log4js"));
const Pipe_1 = require("./Pipe");
const log = log4js_1.default.getLogger('pggit');
const waitForClose = (stream) => new Promise(resolve => stream.on('close', resolve));
exports.default = (oldSqlStream, newSqlStream) => {
    const java = process.env.JAVA_HOME ? path_1.default.join(process.env.JAVA_HOME, 'bin', 'java') : 'java';
    const jar = path_1.default.join(__dirname, '..', '..', 'bin', 'apgdiff.jar');
    const tmpFolder = fs_1.default.mkdtempSync('pg-git');
    const oldFile = path_1.default.resolve(tmpFolder, 'old.sql');
    const newFile = path_1.default.resolve(tmpFolder, 'new.sql');
    log.info(`Creating diff...`);
    const oldStr = fs_1.default.createWriteStream(oldFile);
    const newStr = fs_1.default.createWriteStream(newFile);
    const outDiff = new Pipe_1.Pipe();
    oldSqlStream.pipe(oldStr);
    newSqlStream.pipe(newStr);
    return Promise.all([waitForClose(newStr), waitForClose(oldStr)]).then(() => new Promise(resolve => {
        const apgdiff = child_process_1.spawn(java, ['-jar', jar, oldFile, newFile]);
        apgdiff.on('error', onError);
        apgdiff.on('close', onClose);
        apgdiff.stderr.on('data', onError);
        apgdiff.stdout.pipe(outDiff);
        resolve(outDiff);
        function onClose() {
            if (fs_1.default.existsSync(tmpFolder)) {
                fs_1.default.unlinkSync(oldFile);
                fs_1.default.unlinkSync(newFile);
                fs_1.default.rmdirSync(tmpFolder, { recursive: true });
            }
        }
        function onError(chunk) {
            onClose();
            outDiff.emit('error', chunk instanceof Error ? chunk.message : chunk);
            outDiff.end();
        }
    }));
};
//# sourceMappingURL=diff.js.map
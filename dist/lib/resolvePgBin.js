"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const os_1 = __importDefault(require("os"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const log4js_1 = __importDefault(require("log4js"));
const hasbin_1 = __importDefault(require("hasbin"));
const wget_improved_1 = __importDefault(require("wget-improved"));
const targz_1 = __importDefault(require("targz"));
const extract_zip_1 = __importDefault(require("extract-zip"));
const cli_progress_1 = __importDefault(require("cli-progress"));
const pgVersions_1 = __importDefault(require("./pgVersions"));
const log = log4js_1.default.getLogger('pggit');
const bar1 = new cli_progress_1.default.Bar({}, cli_progress_1.default.Presets.shades_classic);
const arch = `${os_1.default.platform()}-${os_1.default.arch()}`;
const homeFolder = os_1.default.homedir();
const isWindows = os_1.default.platform() === 'win32';
const projectFolder = path_1.default.join(homeFolder, '.pg-git');
const downloadPg = (url, dest) => new Promise((resolve, reject) => {
    const download = wget_improved_1.default.download(url, dest);
    bar1.start(100, 0);
    download.on('error', reject);
    download.on('end', () => {
        bar1.stop();
        bar1.stopTimer();
        resolve();
    });
    download.on('progress', (progress) => bar1.update(progress * 100));
});
const extractArchive = (archiveName) => new Promise((resolve, reject) => {
    const fullPath = path_1.default.join(projectFolder, archiveName);
    const extension = path_1.default.extname(archiveName);
    if (extension === '.gz') {
        targz_1.default.decompress({
            src: fullPath,
            dest: projectFolder,
        }, err => (err ? reject(err) : resolve()));
    }
    else {
        extract_zip_1.default(fullPath, { dir: projectFolder })
            .then(resolve)
            .catch(reject);
    }
});
const moveFile = (from, to) => new Promise((resolve, reject) => fs_1.default.rename(from, to, err => (err ? reject(err) : resolve())));
exports.default = (bin, pgOptions) => new Promise((resolve, reject) => {
    if (bin === 'pg_dump' && pgOptions.pgDumpPath) {
        return resolve(pgOptions.pgDumpPath);
    }
    if (bin === 'psql' && pgOptions.psqlPath) {
        return resolve(pgOptions.psqlPath);
    }
    const { noDownload } = pgOptions;
    if (noDownload && hasbin_1.default.sync(bin)) {
        return resolve(bin);
    }
    if (noDownload) {
        return reject(new Error(`No binary ${bin} found`));
    }
    const { url, version } = pgVersions_1.default(arch, pgOptions.pgVersion);
    if (!fs_1.default.existsSync(projectFolder)) {
        fs_1.default.mkdirSync(projectFolder);
    }
    const pgFolder = `${arch}-${version}`;
    const pgPath = path_1.default.join(projectFolder, pgFolder);
    const binName = isWindows ? `${bin}.exe` : bin;
    const binPath = path_1.default.join(pgPath, 'bin', binName);
    const archiveFile = url.split('/').pop();
    if (fs_1.default.existsSync(pgPath)) {
        return resolve(binPath);
    }
    log.info(`Downloading file ${archiveFile} to ${projectFolder}...`);
    downloadPg(url, path_1.default.join(projectFolder, archiveFile))
        .then(() => log.info(`Extracting file...`))
        .then(() => extractArchive(archiveFile))
        .then(() => log.info(`Replacing with ${pgFolder}...`))
        .then(() => moveFile(path_1.default.join(projectFolder, 'pgsql'), pgPath))
        .then(() => log.info(`Removing downloaded archive...`))
        .then(() => fs_1.default.unlinkSync(path_1.default.join(projectFolder, archiveFile)))
        .then(() => resolve(binPath))
        .catch(reject);
});
//# sourceMappingURL=resolvePgBin.js.map
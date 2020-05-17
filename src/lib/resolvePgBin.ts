import os from 'os';
import path from 'path';
import fs from 'fs';
import log4js from 'log4js';
import hasbin from 'hasbin';
import wget from 'wget-improved';
import targz from 'targz';
import extractZip from 'extract-zip';
import cliProgress from 'cli-progress';
import parseVersion from './pgVersions';
import { PGOptions } from './pgOptions';

type PGExecutable = 'pg_dump' | 'psql';

const log = log4js.getLogger('pggit');
const bar1 = new cliProgress.Bar({}, cliProgress.Presets.shades_classic);
const arch = `${os.platform()}-${os.arch()}`;
const homeFolder = os.homedir();
const isWindows = os.platform() === 'win32';
const projectFolder = path.join(homeFolder, '.pg-git');

const downloadPg = (url: string, dest: string) =>
  new Promise((resolve, reject) => {
    const download = wget.download(url, dest);

    bar1.start(100, 0);
    download.on('error', reject);
    download.on('end', () => {
      bar1.stop();
      bar1.stopTimer();
      resolve();
    });
    download.on('progress', (progress: number) => bar1.update(progress * 100));
  });

const extractArchive = (archiveName: string) =>
  new Promise((resolve, reject) => {
    const fullPath = path.join(projectFolder, archiveName);
    const extension = path.extname(archiveName);

    if (extension === '.gz') {
      targz.decompress(
        {
          src: fullPath,
          dest: projectFolder,
        },
        err => (err ? reject(err) : resolve()),
      );
    } else {
      extractZip(fullPath, { dir: projectFolder }, err => (err ? reject(err) : resolve()));
    }
  });

const moveFile = (from: string, to: string) =>
  new Promise((resolve, reject) => fs.rename(from, to, err => (err ? reject(err) : resolve())));

export default (bin: PGExecutable, pgOptions: PGOptions): Promise<string> =>
  new Promise((resolve, reject) => {
    if (bin === 'pg_dump' && pgOptions.pgDumpPath) {
      return resolve(pgOptions.pgDumpPath);
    }
    if (bin === 'psql' && pgOptions.psqlPath) {
      return resolve(pgOptions.psqlPath);
    }
    const { noDownload } = pgOptions;

    if (noDownload && hasbin.sync(bin)) {
      return resolve(bin);
    }
    if (noDownload) {
      return reject(new Error(`No binary ${bin} found`));
    }
    const { url, version } = parseVersion(arch, pgOptions.pgVersion);

    if (!fs.existsSync(projectFolder)) {
      fs.mkdirSync(projectFolder);
    }
    const pgFolder = `${arch}-${version}`;
    const pgPath = path.join(projectFolder, pgFolder);
    const binName = isWindows ? `${bin}.exe` : bin;
    const binPath = path.join(pgPath, 'bin', binName);
    const archiveFile = url.split('/').pop();

    if (fs.existsSync(pgPath)) {
      return resolve(binPath);
    }
    log.info(`Downloading file ${archiveFile} to ${projectFolder}...`);
    downloadPg(url, path.join(projectFolder, archiveFile))
      .then(() => log.info(`Extracting file...`))
      .then(() => extractArchive(archiveFile))
      .then(() => log.info(`Replacing with ${pgFolder}...`))
      .then(() => moveFile(path.join(projectFolder, 'pgsql'), pgPath))
      .then(() => log.info(`Removing downloaded archive...`))
      .then(() => fs.unlinkSync(path.join(projectFolder, archiveFile)))
      .then(() => resolve(binPath))
      .catch(reject);
  });

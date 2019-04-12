const os = require('os');
const path = require('path');
const fs = require('fs');
const hasbin = require('hasbin');
const wget = require('wget-improved');
const targz = require('targz');
const extractZip = require('extract-zip');
const cliProgress = require('cli-progress');
const parseVersion = require('./pgVersions.js');

const bar1 = new cliProgress.Bar({}, cliProgress.Presets.shades_classic);
const arch = `${os.platform()}-${os.arch()}`;
const homeFolder = os.homedir();
const isWindows = os.platform() === 'windows';
const projectFolder = path.join(homeFolder, '.pg-git');

const downloadPg = (url, dest) => new Promise((resolve, reject) => {
  const download = wget.download(url, dest);
  
  bar1.start(100, 0);
  download.on('error', reject);
  download.on('end', () => {
    bar1.stop();
    bar1.stopTimer();
    resolve();
  });
  download.on('progress', progress => bar1.update(progress * 100));
});

const extractArchive = archiveName => new Promise((resolve, reject) => {
  const fullPath = path.join(projectFolder, archiveName);
  const extension = path.extname(archiveName);
  
  if (extension === '.gz') {
    targz.decompress(
      {
        src: fullPath,
        dest: projectFolder,
      },
      err => err ? reject(err) : resolve(),
    );
  } else {
    extractZip(fullPath, { dir: projectFolder }, err => err ? reject(err) : resolve());
  }
});

const moveFile = (from, to) => new Promise((resolve, reject) => fs.rename(from, to, err => err ? reject(err) : resolve()));

module.exports = bin => new Promise((resolve, reject) => {
  if (bin === 'pg_dump' && process.env.PG_DUMP_PATH) {
    return resolve(process.env.PG_DUMP_PATH);
  }
  if (bin === 'psql' && process.env.PSQL_PATH) {
    return resolve(process.env.PSQL_PATH);
  }
  const noDownload = process.env.NO_DOWNLOAD;

  if (noDownload && hasbin.sync(bin)) {
    return resolve(bin);
  } else if (noDownload) {
    return reject(new Error(`No binary ${bin} found`));
  }
  const { url, version } = parseVersion(arch, process.env.PGVERSION);

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
  console.log(`Downloading file ${archiveFile} to ${projectFolder}...`);
  downloadPg(url, path.join(projectFolder, archiveFile))
    .then(() => console.log(`Extracting file...`))
    .then(() => extractArchive(archiveFile))
    .then(() => console.log(`Replacing with ${pgFolder}...`))
    .then(() => moveFile(path.join(projectFolder, 'pgsql'), pgPath))
    .then(() => console.log(`Removing downloaded archive...`))
    .then(() => fs.unlinkSync(path.join(projectFolder, archiveFile)))
    .then(() => resolve(binPath))
    .catch(reject);
});
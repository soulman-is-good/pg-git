const fs = require('fs');
const path = require('path');
const create = require('./create');

const todoStack = []
const doneStack = []

function createOrExists(folder) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(folder)) {
      resolve();
    } else {
      fs.mkdir(folder, {
        recursive: true,
      }, err => err ? reject(err) : resolve());
    }
  });
}

function processDump(file) {
  const rs = fs.createReadStream(file, { encoding: 'utf8' });
  const patterns = {
    [/^CREATE FUNCTION (\w+?)\.(\w+)/]: createFunction,
    [/^CREATE TABLE (\w+?)\.(\w+)/]: createTable,
    [/^CREATE COMMENT (\w+?)\.(\w+)/]: createComment,
  };

  return new Promise((resolve, reject) => {
    rs.on('data', chunk => {

    });
  });
}

module.exports = function initProject(DUMP_FILE, PROJECT_DIR) {
  return create(DUMP_FILE)
    .then(() => createOrExists(path.join(root, 'src', 'schemas')))
    .then(() => processDump(DUMP_FILE));
};

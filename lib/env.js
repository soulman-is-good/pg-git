'use strict';

const fs = require('fs');
const path = require('path');
const CWD = process.cwd();

module.exports = function(filepath) {
  const ENV_FILE = filepath || path.join(CWD, 'environment.json');
  if (fs.existsSync(ENV_FILE)) {
    const envs = require(ENV_FILE);
    for(let key in envs) {
      process.env[key] = envs[key];
    }
  }
};

'use strict';

const fs = require('fs');
const path = require('path');
const CWD = process.cwd();
const dotenv = require('dotenv');

module.exports = function(filepath) {
  const ENV_FILE = filepath || path.join(CWD, '.env');

  if (fs.existsSync(ENV_FILE)) {
    dotenv.config({ path: ENV_FILE });
  } else {
    dotenv.config();
  }
};

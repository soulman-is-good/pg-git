'use strict';

import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

const CWD = process.cwd();

module.exports = (filepath?: string) => {
  const ENV_FILE = filepath || path.join(CWD, '.env');

  if (fs.existsSync(ENV_FILE)) {
    dotenv.config({ path: ENV_FILE });
  } else {
    dotenv.config();
  }
};

'use strict';

const fs = require('fs');
const pg_dump = require('./pg_dump');

module.exports = function(DUMP_FILE) {
  const ws = fs.createWriteStream(DUMP_FILE);
  return pg_dump(ws);
};

#!/usr/bin/env node
'use strict';

require('./env')();

const os = require('os');
const path = require('path');
// commands
const commit = require('./create');
const migrate = require('./migrate');
// utils
const printUsage = require('./usage');
const promptPassword = require('./password');
const CWD = process.cwd();
const DUMP_FILENAME = process.env.DUMP_FILENAME || 'dump.sql';
const DUMP_FILE = path.join(CWD, DUMP_FILENAME);
const time = Date.now();

let command = parseArguments(process.argv.slice(2));

switch (command) {
  case "commit":
    commit(DUMP_FILE)
      .then(() => {
        console.log(`Dump created successfully ${calcTime(time)}sec.`);
      })
      .catch(console.error);
    break;
  case "migrate":
    migrate(DUMP_FILE)
      .then((status) => {
        console.log(`Migration took ${calcTime(time)}sec. ${status}!`);
      })
      .catch(console.error);
    break;
  case "diff":
    migrate(DUMP_FILE, true)
      .then((status) => {
        console.log(`Done`);
      })
      .catch(console.error);
    break;
  default:
    printUsage();
}

function parseArguments(args) {
  let i;
  let len = args.length;
  let command;
  for (i = 0; i < len; i++) {
    if (args[i].indexOf('--') === 0) {
      applyOption(args[i++].substr(2), args[i]);
    } else if (!command) {
      command = args[i];
    } else {
      process.env.PGDATABASE = args[i] || process.env.PGDATABASE;
    }
  }
  return command;
}

function applyOption(op, val) {
  switch (op) {
    case "user":
      process.env.PGUSER = val;
      break;
    case "password":
      process.env.PGPASSWORD = val;
      break;
    case "W":
      promptPassword();
      break;
    case "host":
      process.env.PGHOST = val;
      break;
    case "port":
      process.env.PGPORT = val;
      break;
    case "dumpname":
      process.env.DUMP_FILENAME = val;
      break;
  }
}

function calcTime(time) {
  return ((Date.now() - time) / 1000).toFixed(3);
}

exports.commit = commit;
exports.migrate = migrate;

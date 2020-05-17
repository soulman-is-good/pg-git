#!/usr/bin/env node
'use strict';

/* eslint-disable */
require('../dist/lib/env')();
require('../dist/lib/setupLog4js')(true);

const os = require('os');
const path = require('path');
const fs = require('fs');
// commands
const pg_dump = require('../dist/lib/pg_dump');
const migrate = require('../dist/lib/migrate');
// utils
const pgOptions = require('../dist/lib/pgOptions');
const printUsage = require('../dist/lib/usage');
const promptPassword = require('../dist/lib/password');

const workDir = process.cwd();
const time = Date.now();
let output = process.stdout;
let command = parseArguments(process.argv.slice(2));

switch (command) {
  case "commit":
    pg_dump()
      .then(ws => {
        ws.pipe(output);
        ws.on('close', () => {
          console.log(`Dump created successfully ${calcTime(time)}sec.`);
        });
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
      applyOption(args[i].substr(2), args[i + 1]);
      i += 1;
    } else if (!command) {
      command = args[i];
    } else {
      pgOptions.password = args[i] || process.env.PGDATABASE;
    }
  }

  return command;
}

function applyOption(op, val) {
  switch (op) {
    case "username":
      pgOptions.user = val;
      break;
    case "password":
      pgOptions.password = val;
      break;
    case "W":
      promptPassword();
      break;
    case "host":
      pgOptions.host = val;
      break;
    case "port":
      pgOptions.port = val;
      break;
    case "dbname":
      pgOptions.database = val;
      break;
    case "dumpname":
      process.env.DUMP_FILENAME = val;
      break;
    case "pg_dump":
      process.env.PG_DUMP_PATH = val;
      break;
    case "psql":
      process.env.PSQL_PATH = val;
      break;
    case "pgversion":
      process.env.PGVERSION = val;
      break;
    case "out":
      output = fs.createWriteStream(val);
      break;
    case "no_download":
      pgOptions.noDownload = !!val;
      break;
  }
}

function calcTime(time) {
  return ((Date.now() - time) / 1000).toFixed(3);
}

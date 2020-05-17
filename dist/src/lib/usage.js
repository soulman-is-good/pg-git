"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const package_json_1 = require("../../package.json");
exports.default = () => {
    console.log(`PgGit version ${package_json_1.version}
Usage: pg-git [options] <command>

Commands:
  commit - Create new dump
  migrate - Make a diff with dump file and apply it to database

Options:
  --user <USERNAME> - database user
  --password <PASSWORD> - database password
  --host <HOST> - pg host
  --port <PORT> - database port
  --dumpname <dumpname> - dump file name. default: dump.sql
  -W - prompt for database password
`);
};
//# sourceMappingURL=usage.js.map
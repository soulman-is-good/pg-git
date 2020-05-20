### PostgreSQL simple code dumping tool with diff migration

![travis](https://travis-ci.org/soulman-is-good/pg-git.svg?branch=master) ![npm](https://img.shields.io/npm/v/pg-git?style=plastic) ![types](https://img.shields.io/npm/types/pg-git?style=plastic)

**Best used with git** :octocat:

This tool was written to help migrate between different servers and to help with distributed development on PostgreSQL.
Tool will automatically download latest Postgres binaries for the platform unless `NO_DOWNLOAD` env or `--no_download` flag is specified.
Else tool will try to use system default `pg_dump` and `psql` files.

WARNING: This tool uses and bundles:

- [apgdiff](https://github.com/fordfrog/apgdiff) v2.6 jar file (requires Java VM)

**node >=11.0.0**

If you want to override this to yours binaries, e.g. system defaulted, then use envirnoment variables or cli params described below.

#### Usage

Commonly tool was develop as standalone and to install as dependency to use with npm. But you can also `require`
it within you project, not much use of it that way though.

```js
const { dump, diff, apply, StringStream } = require('pg-git');

const options = {
  user: 'postgres',
  password: 'postgres',
  database: 'postgres',
  host: 'localhost',
  port: 5432,
  noDownload: true,
};
const newDump = new StringStream('CREATE TABLE public.test(id integer);');

// dump current database, make a diff and apply
dump(options)
  .then(dumpStream => diff(options, dumpStream, newDump))
  .then(diffStream => apply(options, diffStream))
  .catch(console.error);
```

Or you can install tool globaly (or localy and use with npm run ...)

```
npm i -g pg-git
```

And use it in your project

Usage 

```
pgit [options] <command>

Commands:
  commit - Create new dump
  migrate - Make a diff with dump file and apply it to database

Options:
  --user <USERNAME> - database user
  --password <PASSWORD> - database password
  --host <HOST> - pg host
  --port <PORT> - database port
  --dumpname <dumpname> - dump file name. default: dump.sql
  --pgversion <version> - postgres version to use. Specify exact version or only part else latest will be taken. E.g. 10 or 9.5 or 9.4.21
  --psql <path> - path to psql binary
  --pg_dump <path> - path to pg_dump binary
  --no_download <any> - do not download binaries from external resource 
```

Example

```
pg-git --user postgres --password postgres --host 127.0.0.1 --port 5432 commit my_database
```

#### Environment variables

```
PGUSER - Postgres user
PGHOST - Postgres host
PGDATABASE - Postgres database name
PGPASSWORD - Postgres password for user
PGVERSION - postgres version to use. Specify exact version or only part else latest will be taken. E.g. 10 or 9.5 or 9.4.21
PSQL_PATH - Absolute path to your psql binary file
PG_DUMP_PATH - Absolute path to yout pg_dump binary file
NO_DOWNLOAD - do not download binaries from external resource
```

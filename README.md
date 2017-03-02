### PostgreSQL simple code dumping tool with diff migration

**Best used with git**

This tool was written to help migrate between different servers and to help with distributed development on PostgreSQL.

WARNING: This tool uses and bundles:

- pg_dump all platforms
- psql all platforms
- arpdiff-2.4 jar file (requires Java VM)

**node >=4.8.0**

#### Usage

Commonly tool was develop as standalone and to install as dependency to use with npm. But you can also `require`
it with in you project, not much use of it that way though.

```js
const pgit = require('pg-git');

// For now database parameters are only supported via environment variables

// dump current database
pgit.commit(DUMP_FILE)
  .then(ok => console.log('OKEY!')
  .catch(console.error);

// migrate dump to current db
pgit.migrate(DUMP_FILE)
  .then(ok => console.log('Migration completed!')
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
```

Example

```
pg-git --user postgres --password postgres --host 127.0.0.1 --port 5432 commit my_database
```

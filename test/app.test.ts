import { assert } from 'chai';
import { apply, dump, diff, PGOptions } from '../src/index';
import { runPostgres, Container } from './utils';
import { StringStream } from '../src/lib/StringStream';

describe('Main export', function test() {
  let container!: Container;

  const options: Partial<PGOptions> = {
    user: 'master',
    password: '1234qwert=',
    database: 'test',
    port: 5433,
    noDownload: true,
  };

  this.timeout(5000);

  before(async () => {
    container = await runPostgres(options);

    // Wait container start
    return new Promise(resolve => {
      const waitLogs = async () => {
        const logs = (await container.logs({ tail: '10', stdout: true })) as Buffer;

        if (logs.toString().indexOf('PostgreSQL init process complete') > -1) {
          setTimeout(resolve, 1000);
        } else {
          setTimeout(waitLogs, 100);
        }
      };

      waitLogs();
    });
  });

  after(async () => {
    await container.kill();
  });

  it('should execute apply', done => {
    apply(options, 'CREATE TABLE test (id INT);', true)
      .then(result => {
        assert.include(result, 'CREATE TABLE');
        done();
      })
      .catch(done);
  });

  it('should run dump', done => {
    dump(options)
      .then(str => {
        str.on('error', data => done(new Error(data.toString())));
        str.once('data', data => {
          assert.include(data.toString(), 'CREATE TABLE public.test');
          done();
        });
      })
      .catch(done);
  });

  it('should make diff', done => {
    dump(options)
      .then(oldStr => {
        const newStr = new StringStream('CREATE TABLE test(id INT, title TEXT);');

        return diff(options, oldStr, newStr);
      })
      .then(result => {
        const diffResult: string[] = [];

        result.on('data', data => {
          diffResult.push(data.toString());
        });
        result.on('end', () => {
          const str = diffResult.join('\n');

          assert.include(str, 'ALTER TABLE test');
          assert.include(str, 'ADD COLUMN title TEXT');
          done();
        });
      })
      .catch(err => {
        done(err);
      });
  });
});
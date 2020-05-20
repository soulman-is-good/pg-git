import { assert } from 'chai';
import { StringStream } from '../src/lib/StringStream';

describe('StringStream tests', () => {
  it('should create from stream and read', done => {
    const string = 'my test string';
    const ss = new StringStream(string, { highWaterMark: 1 });
    let callTimes = 0;
    let result = '';

    ss.on('data', data => {
      result += data;
      callTimes += 1;
    });
    ss.on('end', () => {
      assert.equal(callTimes, string.length);
      assert.equal(result, string);
      done();
    });
  });

  it('should be writtable stream', done => {
    const ss = new StringStream('', { emitClose: true, allowHalfOpen: false });

    ss.write('test');
    ss.write(' StringStream');
    ss.end('!');
    ss.on('close', () => {
      assert.equal(ss.toString(), 'test StringStream!');
      done();
    });
  });
});

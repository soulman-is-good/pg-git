import { Transform } from 'stream';

export class Pipe extends Transform {
  _transform(chunk: Buffer, enc: string, callback: Function) {
    callback(null, chunk);
  }
}

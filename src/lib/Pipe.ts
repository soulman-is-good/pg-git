import { Transform, TransformCallback, TransformOptions } from 'stream';

type PipeOptions = Omit<TransformOptions, 'read' | 'write' | 'writev' | 'final' | 'destroy' | 'flush' | 'transform'>;

export class Pipe extends Transform {
  constructor(opts?: PipeOptions) {
    super(opts);
  }

  _transform(chunk: Buffer | string, enc: string, callback: TransformCallback) {
    callback(null, chunk);
  }
}

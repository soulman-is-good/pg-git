import { Duplex, DuplexOptions } from 'stream';

type StringStreamOptions = Omit<DuplexOptions, 'read' | 'write' | 'writev' | 'final' | 'destroy'>;

export class StringStream extends Duplex {
  private _string: string;
  private _lastReadBype: number;

  constructor(str?: string, opts?: StringStreamOptions) {
    super(opts);
    this._string = str || '';
    this._lastReadBype = 0;
  }

  _write(chunk: Buffer | string, _encoding: string, callback: (err?: Error) => void) {
    this._string += chunk instanceof Buffer ? chunk.toString() : chunk;
    callback();
  }

  _read(size: number) {
    if (this._lastReadBype >= this._string.length) {
      this.push(null);
    } else {
      const len = Math.min(this._lastReadBype + size, this._string.length);

      this.push(Buffer.from(this._string.substring(this._lastReadBype, len)));
      this._lastReadBype += size;
    }
  }

  _final(callback: (err?: Error) => void) {
    callback();
    this.emit('close');
  }

  toString() {
    return this._string;
  }
}

import { Readable } from 'stream';

export class StringStream extends Readable {
  private _string: string;
  private _lastReadBype: number;

  constructor(str: string) {
    super();
    this._string = str;
    this._lastReadBype = 0;
  }

  _read(size: number) {
    if (this._lastReadBype >= this._string.length) {
      this.push(null);
    } else {
      const len = Math.min(this._lastReadBype + size, this._string.length);

      this.push(Buffer.from(this._string.substring(this._lastReadBype, len)));
      this._lastReadBype = size;
    }
  }
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringStream = void 0;
const stream_1 = require("stream");
class StringStream extends stream_1.Duplex {
    constructor(str, opts) {
        super(opts);
        this._string = str || '';
        this._lastReadBype = 0;
    }
    _write(chunk, _encoding, callback) {
        this._string += chunk instanceof Buffer ? chunk.toString() : chunk;
        callback();
    }
    _read(size) {
        if (this._lastReadBype >= this._string.length) {
            this.push(null);
        }
        else {
            const len = Math.min(this._lastReadBype + size, this._string.length);
            this.push(Buffer.from(this._string.substring(this._lastReadBype, len)));
            this._lastReadBype += size;
        }
    }
    _final(callback) {
        callback();
        this.emit('close');
    }
    toString() {
        return this._string;
    }
}
exports.StringStream = StringStream;
//# sourceMappingURL=StringStream.js.map
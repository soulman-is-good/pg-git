"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringStream = void 0;
const stream_1 = require("stream");
class StringStream extends stream_1.Readable {
    constructor(str) {
        super();
        this._string = str;
        this._lastReadBype = 0;
    }
    _read(size) {
        if (this._lastReadBype >= this._string.length) {
            this.push(null);
        }
        else {
            const len = Math.min(this._lastReadBype + size, this._string.length);
            this.push(Buffer.from(this._string.substring(this._lastReadBype, len)));
            this._lastReadBype = size;
        }
    }
}
exports.StringStream = StringStream;
//# sourceMappingURL=StringStream.js.map
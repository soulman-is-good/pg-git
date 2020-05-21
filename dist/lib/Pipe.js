"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pipe = void 0;
const stream_1 = require("stream");
class Pipe extends stream_1.Transform {
    _transform(chunk, enc, callback) {
        callback(null, chunk);
    }
}
exports.Pipe = Pipe;
//# sourceMappingURL=Pipe.js.map
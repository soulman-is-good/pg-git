"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pipe = exports.StringStream = exports.apply = exports.diff = exports.dump = void 0;
const stream_1 = require("stream");
const setupLog4js_1 = __importDefault(require("./lib/setupLog4js"));
const pgDump_1 = __importDefault(require("./lib/pgDump"));
const diff_1 = __importDefault(require("./lib/diff"));
const psql_1 = __importDefault(require("./lib/psql"));
const Pipe_1 = require("./lib/Pipe");
Object.defineProperty(exports, "Pipe", { enumerable: true, get: function () { return Pipe_1.Pipe; } });
const StringStream_1 = require("./lib/StringStream");
Object.defineProperty(exports, "StringStream", { enumerable: true, get: function () { return StringStream_1.StringStream; } });
const pgOptions_1 = require("./lib/pgOptions");
setupLog4js_1.default();
exports.dump = (options) => pgDump_1.default(pgOptions_1.getPGOptions(options));
exports.diff = (src, dest) => diff_1.default(src, dest);
exports.apply = (options, stringOrStream, returnResult = false) => {
    const stream = stringOrStream instanceof stream_1.Stream ? stringOrStream : new StringStream_1.StringStream(`${stringOrStream}\n`);
    return psql_1.default(pgOptions_1.getPGOptions(options), transation => transation.pipeFrom(stream), returnResult);
};
//# sourceMappingURL=index.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pgGit = void 0;
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('./lib/setupLog4js')();
const pgDump_1 = __importDefault(require("./lib/pgDump"));
const diff_1 = __importDefault(require("./lib/diff"));
const psql_1 = __importDefault(require("./lib/psql"));
const pgOptions_1 = require("./lib/pgOptions");
exports.pgGit = {
    dump(options) {
        return pgDump_1.default(Object.assign(pgOptions_1.pgOptions, options));
    },
    diff(src, dest) {
        return diff_1.default(src, dest);
    },
    apply(stringStream) {
        return psql_1.default(transation => {
            stringStream.pipe(transation);
        });
    },
};
//# sourceMappingURL=index.js.map
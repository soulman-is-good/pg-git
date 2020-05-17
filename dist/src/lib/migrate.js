"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const diff_1 = __importDefault(require("./diff"));
const psql_1 = __importDefault(require("./psql"));
const pgDump_1 = __importDefault(require("./pgDump"));
exports.default = (pgOptions, newSql, justPrintDiff) => {
    return pgDump_1.default(pgOptions)
        .then(oldDump => {
        return diff_1.default(pgOptions, oldDump, newSql);
    })
        .then(diffStr => new Promise((resolve, reject) => {
        if (justPrintDiff) {
            diffStr.on('error', reject);
            diffStr.pipe(process.stdout);
            diffStr.on('close', () => resolve());
        }
        else {
            psql_1.default(pgOptions, transaction => {
                diffStr.pipe(transaction);
            })
                .then(resolve)
                .catch(reject);
        }
    }));
};
//# sourceMappingURL=migrate.js.map
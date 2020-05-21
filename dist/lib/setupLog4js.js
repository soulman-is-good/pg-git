"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const log4js_1 = __importDefault(require("log4js"));
exports.default = (showLog = false) => {
    if (process.env.DEBUG || showLog) {
        log4js_1.default.configure({
            appenders: { console: { type: 'console' } },
            categories: { pggit: { appenders: ['console'], level: process.env.PGGIT_LOG_LEVEL || 'info' } },
        });
    }
};
//# sourceMappingURL=setupLog4js.js.map
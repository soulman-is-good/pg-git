const log4js = require('log4js');
module.exports = (showLog) => {
    if (process.env.DEBUG || showLog) {
        log4js.configure({
            appenders: { console: { type: 'console' } },
            categories: { pggit: { appenders: ['console'], level: process.env.PGGIT_LOG_LEVEL || 'info' } }
        });
    }
};
//# sourceMappingURL=setupLog4js.js.map
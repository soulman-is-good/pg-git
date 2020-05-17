import log4js from 'log4js';

export default (showLog = false) => {
  if (process.env.DEBUG || showLog) {
    log4js.configure({
      appenders: { console: { type: 'console' } },
      categories: { pggit: { appenders: ['console'], level: process.env.PGGIT_LOG_LEVEL || 'info' } },
    });
  }
};

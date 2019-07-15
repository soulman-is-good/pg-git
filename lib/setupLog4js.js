const log4js = require('log4js');

module.exports = () => log4js.configure({
  appenders: { console: { type: 'console' } },
  categories: { default: { appenders: ['console'], level: process.env.LEVEL || 'info' } }
});
const log4js = require('log4js');

log4js.configure({
    appenders: {
        file: {type: 'file', filename: 'logs/log.txt', pattern: 'yyyy-MM-dd-hh', compress: true},
        stdout: {type: 'stdout'}
    },
    categories: {
        default: { appenders: ['file', 'stdout'], level: 'debug'},
        trc: {appenders: ['file'], level: 'trace'}
    }
});

const loggerDefault = log4js.getLogger();
const loggerTrace = log4js.getLogger('trc');

let logger = {
    trace: str => loggerTrace.trace(str),
    debug: str => loggerDefault.debug(str),
    info: str => loggerDefault.info(str),
    warn: str => loggerDefault.warn(str),
    error: str => loggerDefault.error(str),
    fatal: str => loggerDefault.fatal(str),
    shutdown: async () => await log4js.shutdown()
}

exports.Logger = logger;
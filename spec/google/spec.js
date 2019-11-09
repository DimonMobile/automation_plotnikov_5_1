// logger configuration
const log4js = require('log4js');
const gmailApi = require('./gmail.js');

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
    fatal: str => loggerDefault.fatal(str)
}

// preparing allure
const AllureReporter = require('jasmine-allure-reporter');
jasmine.getEnv().addReporter(new AllureReporter({
    resultsDir: 'allure-results'
}));

let auth;
let messagesAmount = 0;

let itCaptions = ['Authorization', 'Recieving messages data', 'Amount of messages is equal to 2']

describe('GoogleMail api', function() {

    // throwing exception means test fail
    it(itCaptions[0], function() {
        logger.debug(`it(${itCaptions[0]})`);
        auth = gmailApi.authorize(logger)
        logger.debug(`end of it(${itCaptions[0]})`);
    });

    // throwing exception means test fail
    it(itCaptions[1], async function() {
        logger.debug(`it(${itCaptions[1]})`);
        messagesAmount = await gmailApi.getMessagesList(logger, auth);
        logger.debug(`end of it(${itCaptions[1]})`);
    });

    it(itCaptions[2], function() {
        logger.debug(`it(${itCaptions[2]})`);
        expect(messagesAmount).toBe(2);
        logger.debug(`end of it(${itCaptions[2]})`);
    });
});
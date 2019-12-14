// logger configuration
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
    fatal: str => loggerDefault.fatal(str)
}

// preparing webdriver
//let browser = require('wdio').getBrowser('UiAutomator2');
require('wdio');
const { Builder, By, Key, until } = require('selenium-webdriver');
//let driver = new Builder().forBrowser('UiAutomator2').build();
let resultsCount = 0;
let dateStarted;

// preparing allure
const AllureReporter = require('jasmine-allure-reporter');
jasmine.getEnv().addReporter(new AllureReporter({
    resultsDir: 'allure-results'
}));

// preparing PageObject pattern

beforeAll(function () {
    logger.info('before all');
}, 20000);

afterAll(function () {
    logger.info('after all');
    log4js.shutdown();
}, 20000);

describe('describeStr', function () {
    logger.debug('inside describe');
    it('какать', function () {
        logger.debug('kaban');
        expect(true).toBe(true);
    }, 20000);
});
 
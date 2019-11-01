// arguments processing logic
let browser = 'chrome';
if (process.argv.length > 2) {
    let regex = /--browser=(\w+)/;
    browser = process.argv[2].match(regex)[1];
}

// preparing selenium, config and logger
require('chromedriver');
require('geckodriver');

const Config = require('../../testData.js');

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
const { Builder, By, Key, until } = require('selenium-webdriver');
let driver = new Builder().forBrowser(browser).build();
let resultsCount = 0;
let dateStarted;

// preparing allure
const AllureReporter = require('jasmine-allure-reporter');
jasmine.getEnv().addReporter(new AllureReporter({
    resultsDir: 'allure-results'
}));

// preparing PageObject pattern
let GooglePage = require('./google-page.js');

let page = new GooglePage.Page(driver, By, Key, until, logger);
let resultsPage = null;

beforeAll(async function () {
    logger.trace('beforeAll');
    dateStarted = new Date();
    await page.open();
    await page.setSearchQuery(Config.searchString);
    resultsPage = await page.submitQuery();
}, 20000);

afterAll(async function () {
    await driver.quit();
    logger.trace(`Results: ${resultsCount}; Time: ${new Date() - dateStarted}ms`);

    await log4js.shutdown();
}, 20000);

const describeStr = `Googling ${Config.searchString}`;
const firstItDescription = 'Each google result contains text on the first page';
const secondItDescription = 'Each google result cointains text on the second page';
const thirdItDescription = `Results amount greater than ${Config.expectedResults}`;

describe(describeStr, function () {
    logger.info(`${describeStr} starts`);

    it(firstItDescription, async function () {
        logger.info(`${firstItDescription} starts`);
        for (text of await resultsPage.getSearchItemsTexts()) {
            await expect(text.toLowerCase()).toContain(Config.searchString.toLowerCase());
        }
        await resultsPage.nextPage();
        logger.info(`${firstItDescription} finished`);
    }, 20000);

    it(secondItDescription, async function () {
        logger.info(`${secondItDescription} starts`);
        for (text of await resultsPage.getSearchItemsTexts()) {
            await expect(text.toLowerCase()).toContain(Config.searchString.toLowerCase());
        }
        logger.info(`${secondItDescription} finished`);
    }, 20000);

    it(thirdItDescription, async function() {
        logger.info(`${thirdItDescription} starts`);
        resultsCount = await resultsPage.getResultsCount();
        await expect(resultsCount).toBeGreaterThan(Config.expectedResults);
        logger.info(`${thirdItDescription} finished`);
    }, 20000);

    logger.info(`${describeStr} finished`);
});
 
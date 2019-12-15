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
const logger = require('./support/logger').Logger;

// preparing webdriver
const { Builder, By, Key, until } = require('selenium-webdriver');
let driver = new Builder().forBrowser(browser).build();

// preparing allure
const AllureReporter = require('jasmine-allure-reporter');
jasmine.getEnv().addReporter(new AllureReporter({
    resultsDir: 'allure-results'
}));

let MainPage = require('./pages/storepage');
let mainPage = new MainPage.Page(driver, By, Key, until, logger);

beforeAll(async function () {
    logger.trace('beforeAll');
    await mainPage.open();
}, 20000);

afterAll(async function () {
//    await driver.quit();
    await logger.shutdown();
}, 20000);

describe('11_Steam', function () {
    it('Genre exists', async () => {
        await expect(await mainPage.clickGameGenre('Action')).toBe(true);
    });

    it('Obtain the game', async () => {
        let games = await mainPage.getGamesList();
        if (games.hasDiscounts) {
            await mainPage.clickGameByHighestDiscount(games);
        } else {
            await mainPage.clickGameByHighestPrice(games);
        }
    });
});
 
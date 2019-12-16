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
let GamePage = require('./pages/gamepage');
let storePage = new MainPage.Page(driver, By, Key, until, logger);
let gamePage = new GamePage.Page(driver, By, Key, until, logger);

beforeAll(async function () {
    logger.debug('beforeAll()');
    await storePage.open();
}, 30000);

afterAll(async function () {
    logger.debug('afterAll()')
    await driver.quit();
    await logger.shutdown();
}, 30000);

describe('11_Steam', function () {
    let listGameData;

    it('Genre exists', async () => {
        await expect(await storePage.clickGameGenre('Action')).toBeTrue();
    }, 30000);

    it('Obtain the game', async () => {
        let games = await storePage.getGamesList();
        if (games.hasDiscounts) {
            listGameData = await storePage.clickGameByHighestDiscount(games);
        } else {
            listGameData = await storePage.clickGameByHighestPrice(games);
        }
        await gamePage.checkAndProcessAgegate(1990);
    }, 30000);

    it('Compare price and discount', async () => {
        let gameData = await gamePage.getGameData();
        expect(gameData.price).toBe(listGameData.price);
        expect(gameData.discount).toBe(listGameData.discount);
    }, 30000);
});
 
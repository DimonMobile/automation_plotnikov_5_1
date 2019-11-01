// arguments processing logic
let browser = 'chrome';
if (process.argv.length > 2) {
    let regex = /--browser=(\w+)/;
    browser = process.argv[2].match(regex)[1];
}

// preparing selenium and config
require('chromedriver');
require('geckodriver');
const Config = require('../../testData.js');

const { Builder, By, Key, until } = require('selenium-webdriver');
let driver = new Builder().forBrowser(browser).build();
let resultsCount = 0;
let dateStarted;

// using PageObject pattern
let GooglePage = require('./google-page.js');

let page = new GooglePage.Page(driver, By, Key, until);
let resultsPage = null;

beforeAll(async function () {
    dateStarted = new Date();
    await page.open();
    await page.setSearchQuery(Config.searchString);
    resultsPage = await page.submitQuery();
}, 20000);

afterAll(async function () {
    await driver.quit();
    console.log(`\nResults: ${resultsCount}`);
    console.log(`Time: ${new Date() - dateStarted}ms`);
}, 20000);

describe('Google', function () {
    it('Each google result contains text on the first page', async function () {
        for (text of await resultsPage.getSearchItemsTexts()) {
            await expect(text).toContain(Config.searchString);
        }
        await resultsPage.nextPage();
    }, 20000);

    it('Each google result cointains text on the second page', async function () {
        for (text of await resultsPage.getSearchItemsTexts()) {
            await expect(text).toContain(Config.searchString);
        }
    }, 20000);

    it(`Results amount greater than ${Config.expectedResults}`, async function() {
        let count = await resultsPage.getResultsCount();
        await expect(count).toBeGreaterThan(Config.expectedResults);
    }, 20000);
});
 
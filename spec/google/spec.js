let browser = 'chrome';
if (process.argv.length > 2) {
  let regex = /--browser=(\w+)/;
  browser = process.argv[2].match(regex)[1];
}

require('chromedriver');
require('geckodriver');
const Config = require('../../testData.js');

const { Builder, By, Key, until } = require('selenium-webdriver');
let driver = new Builder().forBrowser(browser).build();
let resultsCount = 0;
let dateStarted;

beforeAll(function (done) {
  driver.get('https://google.com/').then(() => {
    driver.findElement(By.name('q')).then(tag => {
      tag.sendKeys(Config.searchString).then(() => {
        tag.sendKeys(Key.ENTER);
        done();
      });
    });
  });
  dateStarted = new Date();
}, 10000);

afterAll(async function(done) {
  await driver.quit();
  console.log(`\nResults: ${resultsCount}`);
  console.log(`Time: ${new Date() - dateStarted}ms`);
  done();
});

describe('Google iTechArt', function () {
  it('iTechArt text on first page', function (done) {
    // I have not found another way to handle page loaded event:(
    driver.wait(async function () {
      const readyState = await driver.executeScript('return document.readyState');
      return readyState === 'complete';
    }).then(() => {
      driver.getPageSource().then(source => {
        expect(source.includes(Config.searchString)).toBe(true);
        done();
      });
    });
  });

  it('iTechArt text on second page', async function (done) {
    await driver.wait(until.elementLocated(By.id('pnnext')));
    await driver.findElement(By.id('pnnext'))
      .then(element => element.click());
    await driver.wait(async function () {
      const readyState = await driver.executeScript('return document.readyState');
      return readyState === 'complete';
    });
    driver.getPageSource().then(source => {
      expect(source.includes(Config.searchString)).toBe(true);
      done();
    });
  });

  it('Results count greater than x', async function(done) {
    let element = await driver.wait(until.elementLocated(By.id('resultStats')));
    let text = await element.getText();
    let regex = /((\d+\s*)+)/;
    let found = text.match(regex)[1];
    found = found.replace(' ', '');
    resultsCount = parseInt(found);
    expect(resultsCount).toBeGreaterThan(Config.expectedResults);
    done();
  });
});

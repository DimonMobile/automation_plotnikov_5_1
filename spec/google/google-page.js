let ResultsPage = require('./results-page.js').ResultsPage;

exports.Page = function (driver, By, Key, Until, logger) {

    this.inputElement = null;

    this.open = async () => {
        logger.debug('GooglePage.open()');
        await driver.get('https://google.com/');
    }

    this.setSearchQuery = async (query) => {
        logger.debug(`GooglePage.setSearchQuery(${query})`);
        this.inputElement = await driver.wait(Until.elementLocated(By.name('q')));
        await this.inputElement.sendKeys(query);
    }

    this.submitQuery = async () => {
        logger.debug(`GooglePage.submitQuery()`);
        await this.inputElement.sendKeys(Key.ENTER);
        return new ResultsPage(driver, By, Key, Until, logger);
    }
}


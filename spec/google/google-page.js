let ResultsPage = require('./results-page.js').ResultsPage;

exports.Page = function (driver, By, Key, Until) {

    this.inputElement = null;

    this.open = async function() {
        await driver.get('https://google.com/');
    }

    this.setSearchQuery = async function (query) {
        this.inputElement = await driver.wait(Until.elementLocated(By.name('q')));
        await this.inputElement.sendKeys(query);
    }

    this.submitQuery = async function() {
        await this.inputElement.sendKeys(Key.ENTER);
        return new ResultsPage(driver, By, Key, Until);
    }
}


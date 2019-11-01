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

function ResultsPage(driver, By, Key, Until) {
    
    this.srgElement = null;
    this.gElements = null;

    this.getSearchItemsTexts = async function() {
        this.srgElement = await driver.wait(Until.elementLocated(By.className('srg')));
        this.gElements = await this.srgElement.findElements(By.className('g'));
        let result = [];
        this.gElements.forEach(async (element) => {
            result.push(await element.getText());
        });
        return result;
    }

    this.nextPage = async function() {
        let nextElement = await driver.wait(Until.elementLocated(By.id('pnnext')));
        await nextElement.click();
    }

    this.getResultsCount = async function() {
        let element = await driver.wait(Until.elementLocated(By.id('resultStats')));
        let text = await element.getText();
        let regex = /((\d+\s*)+)/;
        let found = text.match(regex)[1];
        found = found.replace(' ', '');
        resultsCount = parseInt(found);
        return resultsCount;
    }
}
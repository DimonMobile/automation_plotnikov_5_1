exports.ResultsPage = function (driver, By, Key, Until, logger) {
    
    this.srgElement = null;
    this.gElements = null;

    this.getSearchItemsTexts = async function() {
        await logger.debug(`ResultsPage.getSearchItemsTexts()`);
        this.srgElement = await driver.wait(Until.elementLocated(By.className('srg')));
        this.gElements = await this.srgElement.findElements(By.className('g'));
        let result = [];
        for(element of this.gElements) {
            result.push(await element.getText());
        }
        await logger.debug(`return: ${result.toString()}`);
        return result;
    }

    this.nextPage = async function() {
        await logger.debug(`ResultsPage.nextPage()`);
        let nextElement = await driver.wait(Until.elementLocated(By.id('pnnext')));
        await nextElement.click();
    }

    this.getResultsCount = async function() {
        await logger.debug(`ResultsPage.getResults()`);
        let element = await driver.wait(Until.elementLocated(By.id('resultStats')));
        let text = await element.getText();
        let regex = /((\d+\s*)+)/;
        let found = text.match(regex)[1];
        found = found.replace(' ', '');
        resultsCount = parseInt(found);
        await logger.debug(`return: ${resultsCount}`);
        return resultsCount;
    }
}
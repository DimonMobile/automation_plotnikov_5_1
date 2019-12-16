let util = require('util');
let StorePage = require('./storepage');

let GamePage = function (driver, By, Key, Until, logger) {
    this.getGameData = async () => {
        logger.debug('GamePage.getGameData()');
        let gamePurchaseElemnt = await driver.wait(Until.elementLocated(By.className('game_purchase_action')));
        let discount;
        try {
            let discountBadge = await gamePurchaseElemnt.findElement(By.className('discount_pct'));
            discount = parseFloat(await discountBadge.getText());
        } catch (e) {
            discount = 0;
        }

        let discountFinalPriceElement = await gamePurchaseElemnt.findElement(By.className('discount_final_price'));
        let price = parseFloat((await discountFinalPriceElement.getText()).substr(1));
        return {
            price: price,
            discount: discount
        };
    }
}

util.inherits(GamePage, StorePage.Page);
exports.Page = GamePage;
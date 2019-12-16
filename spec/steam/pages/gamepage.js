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
        let price = parseFloat((await discountFinalPriceElement.getText()).substr(1)); // skip first $ symbol
        return {
            price: price,
            discount: discount
        };
    }

    this.checkAndProcessAgegate = async(year) => {
        logger.debug(`GamePage.checkAndProcessAgegate(${year})`);
        logger.info('Looking for agegate...');
        await driver.wait(Until.elementLocated(By.className('game_page_background')));

        let agegateExists = true;
        try {
            await driver.findElement(By.className('agegate_birthday_selector'));
        } catch (e) {
            agegateExists = false;
        }
        if (agegateExists) {
            logger.info('Agegate found. Processing.');
            await driver.executeScript(`document.getElementById("ageYear").value = "${year}";`);
            let viewPageBtn = await driver.findElement(By.className('btnv6_blue_hoverfade'));
            await viewPageBtn.click();
        } else {
            logger.info('Agegate not found. Skipping.');
        }
    }
}

// GamePage contains main elements of StorePage such as genre menu and so on. So methods of StorePage can be applied to GamePage.
util.inherits(GamePage, StorePage.Page);

exports.Page = GamePage;
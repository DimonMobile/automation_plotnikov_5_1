exports.Page = function (driver, By, Key, Until, logger) {

    this.open = async () => {
        logger.debug('storepage.open()');
        await driver.get('https://store.steampowered.com');
    }

    this.clickGameGenre = async (genreName) => {
        logger.debug(`storepage.open(${genreName})`);

        const genresDivId = 'genre_flyout';

        await driver.wait(Until.elementLocated(By.id(genresDivId)));
        let genresDiv = await driver.findElement(By.id(genresDivId));
        let elements = await genresDiv.findElements(By.className('popup_menu_item'));

        for (let element of elements) {
            const elementName = (await element.getAttribute('innerText')).trim();
            const elementHref = await element.getAttribute('href');
            if (genreName === elementName) {
                await driver.get(elementHref);
                return true;
            }
        }
        return false;
    }

    this.getGamesList = async () => {
        logger.debug(`storepage.getGamesList()`);
        let element = await driver.wait(Until.elementLocated(By.id('NewReleasesRows')));
        let elements = await element.findElements(By.className('tab_item'));

        let items = [];
        let hasDiscounts = false;
        for (let gameElement of elements) {
            let discount;
            try {
                let discountBagde = await gameElement.findElement(By.className('discount_pct'));
                discount = parseInt(await discountBagde.getText());
                hasDiscounts = true;
            } catch (e) {
                discount = 0;
            }

            let discountPriceBadge = await gameElement.findElement(By.className('discount_final_price'));
            let price = (await discountPriceBadge.getText()).substr(1);
            let gameObject = {
                discount: discount,
                price: price,
                element: gameElement
            };
            items.push(gameObject);
        }
        return {
            hasDiscounts: hasDiscounts,
            items: items
        };
    }
    
    this.clickGameByHighestDiscount = async function(games) {
        logger.debug(`storepage.clickGameByHighestDiscount(games)`);
        let items = games.items;
        let maxDiscount = 0;
        let maxElement = undefined;

        for (let game of items) {
            if (game.discount < maxDiscount) {
                maxElement = game.element;
                maxDiscount = game.discount;
            }
        }

        maxElement.click();
    }

    this.clickGameByHighestPrice = async function(games) {
        logger.debug(`storepage.clickGameByHighestPrice(games)`);
        let items = games.items;
        let maxPrice = 0;
        let maxElement = undefined;

        for (let game of items) {
            if (game.price > maxPrice) {
                maxElement = game.element;
                maxDiscount = game.price;
            }
        }

        maxElement.click();
    }
}
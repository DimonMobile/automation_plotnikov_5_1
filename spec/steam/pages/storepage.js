let fs = require('fs');
let conf = require('../support/conf');

exports.Page = function (driver, By, Key, Until, logger) {

    this.open = async () => {
        logger.debug('storepage.open()');
        await driver.get('https://store.steampowered.com');
    }

    this.clickGameGenre = async (genreName) => {
        logger.debug(`storepage.clickGameGenre(${genreName})`);

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
                discount = parseFloat(await discountBagde.getText());
                hasDiscounts = true;
            } catch (e) {
                discount = 0;
            }

            let discountPriceBadge = await gameElement.findElement(By.className('discount_final_price'));
            let price = parseFloat((await discountPriceBadge.getText()).substr(1));
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

    this.clickGameByHighestDiscount = async function (games) {
        logger.debug(`storepage.clickGameByHighestDiscount(games)`);
        let items = games.items;
        let maxDiscount = 0;
        let pickedPrice = 0;
        let maxElement = undefined;

        for (let game of items) {
            if (game.discount < maxDiscount) {
                maxElement = game.element;
                maxDiscount = game.discount;
                pickedPrice = game.price;
            }
        }

        maxElement.click();
        return {
            discount: maxDiscount,
            price: pickedPrice
        };
    }

    this.clickGameByHighestPrice = async function (games) {
        logger.debug(`storepage.clickGameByHighestPrice(games)`);
        let items = games.items;
        let maxprice = 0;
        let maxElement = undefined;
        let pickedDiscount = 0;

        for (let game of items) {
            if (game.price > maxprice) {
                maxElement = game.element;
                maxprice = game.price;
                pickedDiscount = game.discount;
            }
        }

        maxElement.click();

        return {
            discount: pickedDiscount,
            price: maxprice
        };
    }

    this.clickInstallSteamBtnAndDownloadSteam = async function () {
        return new Promise(async (resolve, error) => {
            logger.debug(`storepage.clickInstallSteamBtn()`);
            let installSteamBtn = await driver.wait(Until.elementLocated(By.className('header_installsteam_btn_content')));
            await installSteamBtn.click();

            let oldFileOperations = 0;
            let fileOperations = oldFileOperations;

            let checkerTimer;
            let watcher = fs.watch(conf.DownloadsPath, (event, filename) => {
                ++fileOperations;
                if (event === 'change' && filename.match(/^.+\.exe$/)) {
                    watcher.close();
                    if (checkerTimer != undefined)
                        clearInterval(checkerTimer);
                    resolve(true);
                }
            });

            let downloadSteamBtn = await driver.wait(Until.elementLocated(By.className('about_install_steam_link')));
            await downloadSteamBtn.click();

            // If no new file operations for a lot of time, probably we can consider it as an error.
            checkerTimer = setInterval(() => {
                logger.info('Checking file operations.');
                if (fileOperations === oldFileOperations) {
                    logger.info('No file operations. Aborting.');
                    watcher.close();
                    clearInterval(checkerTimer);
                    resolve(false);
                } else {
                    logger.info('File operations detected. Continue.');
                    oldFileOperations = fileOperations;
                }
            }, conf.DownloadsCheckingInterval);
        });
    }
}
const fs = require('fs');
const {Builder, By, Key, until} = require('selenium-webdriver');

let driver = new Builder().forBrowser('firefox').build();

driver.get('https://onliner.by').then(() => {
    driver.findElement(By.className('b-top-actions')).then(webElement => {
        webElement.takeScreenshot(true).then(base64 => {
            fs.writeFile('screens/byClassName.png', base64, 'base64', err => {});
        });
    });
    driver.findElement(By.id('userbar')).then(webElement => {
         webElement.takeScreenshot(true).then(base64 => {
            fs.writeFile('screens/byId.png', base64, 'base64', err => {});
        });
    });
    driver.findElement(By.name('query')).then(webElement => {
        webElement.takeScreenshot(true).then(base64 => {
            fs.writeFile('screens/byName.png', base64, 'base64', err => {});
        });
    });
    driver.findElements(By.tagName('footer')).then(webElements => {
        webElements[5].takeScreenshot(true).then(base64 => {
            fs.writeFile('screens/tagName.png', base64, 'base64', err => {});
        });
    });
    driver.findElement(By.linkText('Вакансии')).then(webElements => {
        webElements.takeScreenshot(true).then(base64 => {
            fs.writeFile('screens/linkText.png', base64, 'base64', err => {});
        });
    });
    driver.findElement(By.partialLinkText('Поддержка')).then(webElements => {
        webElements.takeScreenshot(true).then(base64 => {
            fs.writeFile('screens/partialLinkText.png', base64, 'base64', err => {});
        });
    });
    driver.findElement(By.css('a span .project-navigation__sign')).then(webElements => {
        webElements.takeScreenshot(true).then(base64 => {
            fs.writeFile('screens/byCss.png', base64, 'base64', err => {});
        });
    });
});
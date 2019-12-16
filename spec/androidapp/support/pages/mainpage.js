let logger = require('../logger').Logger;
let conf = require('../conf');

exports.Page = function() {
    this.clickLogInBtn = function() {
        logger.debug(`MainPage.clickLogInBtn()`);
        try {
            let loginBtn = $('android=new UiSelector().description("Login Button")');
            loginBtn.waitForExist(conf.ElementWaitingTimeout);
            loginBtn.click();
            return true;
        } catch (e) {
            return false;
        }
    }
}
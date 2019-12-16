let logger = require('../logger').Logger;
let conf = require('../conf');

exports.Page = function () {
    this.fillUserName = function (userName) {
        logger.debug(`AuthorizePage.fillUserName(${userName})`);
        try {
            let userNameTextEdit = $('android=new UiSelector().resourceId("user_username")');
            userNameTextEdit.waitForExist(conf.ElementWaitingTimeout);
            userNameTextEdit.setValue(userName);
            return true;
        } catch (e) {
            return false;
        }
    }

    this.fillUserPassword = function (userPassword) {
        logger.debug(`AuthorizePage.fillUserPassword(${userPassword})`);
        try {
            let userPasswordTextEdit = $('android=new UiSelector().resourceId("user_password")');
            userPasswordTextEdit.waitForExist(conf.ElementWaitingTimeout);
            userPasswordTextEdit.setValue(userPassword);
            return true;
        } catch (e) {
            return false;
        }
    }

    this.clickSubmit = function () {
        logger.debug(`AuthorizePage.clickSubmit()`);
        try {
            let submitBtn = $('android=new UiSelector().resourceId("submit")');
            submitBtn.waitForExist(conf.ElementWaitingTimeout);
            submitBtn.click();
            return true;
        } catch (e) {
            return false;
        }
    }

    this.getErrorText = function () {
        logger.debug(`AuthorizePage.getErrorText()`);
        try {
            let errorMsgElement = $('android=new UiSelector().className("android.view.View").childSelector(textContains("error!"))');
            errorMsgElement.waitForExist(conf.ElementWaitingTimeout);
            return errorMsgElement.getText();
        } catch (e) {
            return '';
        }
    }
}
// logger configuration
// const log4js = require('log4js');

// log4js.configure({
//     appenders: {
//         file: {type: 'file', filename: 'logs/log.txt', pattern: 'yyyy-MM-dd-hh', compress: true},
//         stdout: {type: 'stdout'}
//     },
//     categories: {
//         default: { appenders: ['file', 'stdout'], level: 'debug'},
//         trc: {appenders: ['file'], level: 'trace'}
//     }
// });

// const loggerDefault = log4js.getLogger();
// const loggerTrace = log4js.getLogger('trc');

// let logger = {
//     trace: str => loggerTrace.trace(str),
//     debug: str => loggerDefault.debug(str),
//     info: str => loggerDefault.info(str),
//     warn: str => loggerDefault.warn(str),
//     error: str => loggerDefault.error(str),
//     fatal: str => loggerDefault.fatal(str)
// }

describe('describeStr', function () {
    it('какать', function () {
        let loginBtn = $('android=new UiSelector().description("Login Button")');
        loginBtn.waitForExist(10000);
        loginBtn.click();
        let userNameTextEdit = $('android=new UiSelector().resourceId("user_username")');
        userNameTextEdit.waitForExist(10000);
        let userPasswordTextEdit = $('android=new UiSelector().resourceId("user_password")');
        userPasswordTextEdit.waitForExist(10000);
        let submitBtn = $('android=new UiSelector().resourceId("submit")');
        submitBtn.waitForExist(10000);

        userNameTextEdit.setValue('kek');
        userPasswordTextEdit.setValue('kek');
        submitBtn.click();

        let errorMsgElement = $('android=new UiSelector().className("android.view.View").childSelector(textContains("error!"))');
        errorMsgElement.waitForExist(10000);
        let errorText = errorMsgElement.getText();
        if (errorText.includes("We didn't recognize the username or password you entered. Please try again.")) {
            console.log("UIIIIIIIIIIIIIIIIIIIIII**************************");
        }
    }, 50000);
});

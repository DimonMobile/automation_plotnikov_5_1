let MainPage = require('./support/pages/mainpage');
let AuthorizePage = require('./support/pages/authorizepage');
let mainpage = new MainPage.Page();
let authorizepage = new AuthorizePage.Page();

let conf = require('./support/conf');

const assert = require('assert');

describe('Android appium test', function () {
    it('Click log in btn', function () {
        expect(mainpage.clickLogInBtn()).toBeTrue();
    }, conf.TestTimeout);

    it('Fill username', function() {
        let randUserName = conf.usernames[Math.floor(Math.random() * conf.usernames.length)];
        expect(authorizepage.fillUserName(randUserName)).toBeTrue();
    }, conf.TestTimeout);

    it('Fill user password', function() {
        let randPassword = conf.passwords[Math.floor(Math.random() * conf.passwords.length)];
        expect(authorizepage.fillUserPassword(randPassword)).toBeTrue();
    }, conf.TestTimeout);

    it('Click sign in btn', function() {
        expect(authorizepage.clickSubmit()).toBeTrue();
    }, conf.TestTimeout)

    it('Compare error texts', function() {
        let errorText = authorizepage.getErrorText();
        // Не понял зачем он, ну лан
        assert.strictEqual(errorText.includes("We didn't recognize the username or password you entered. Please try again."), true);
    }, conf.TestTimeout);
});

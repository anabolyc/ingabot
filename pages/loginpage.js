const consts = require("../modules/consts")
const credentials = require(process.env.APP_ING_CRED_PATH || "../.secret/inglogin")

const log = require("../modules/log")("App.LoginPage");

class LoginPage {

    constructor(browser) {
        this.browser = browser
    }

    async loginTextBox() {
        const id = "login-input";
        return await this.browser.getById(id);
    }

    async submitButton() {
        const xpath = "/html//div[@id='body-region']/section/div[@class='ing-password-container']//div[@class='js-login-container']/div/ing-button[@role='button']";
        return await this.browser.getByXPath(xpath);
    }

    async cookiesButton() {
        const xpath = "/html/body[@class='ing-new-theme']//div[@class='cookie-policy_content row']/a[@href='#']";
        return await this.browser.getByXPath(xpath);
    }

    async passwordBox(num) {
        return await this.browser.getById(`mask-${num}`, 100);
    }

    async login() {
        log.info(`Entering login page: ${consts.LOGIN_HOME_URL}`);
        await this.browser.get(consts.LOGIN_HOME_URL);

        log.info(`Filling in login: ${credentials.name}`);
        const loginBox = await this.loginTextBox();
        await loginBox.sendKeys(credentials.name);
        await loginBox.sendKeys("\n");

        log.info(`Filling in password`);
        let passLetter = null;
        for (let i = 0; i < credentials.password.length; i++) {
            try {
                log.info(`\t char: ${i}`);
                passLetter = await this.passwordBox(i + 1);
                await passLetter.sendKeys(credentials.password.substr(i, 1));
            } catch (e) {}
        }

        log.info(`Agreeing on cookies`);
        const cookiesButton = await this.cookiesButton();
        await cookiesButton.click();

        log.info(`Submitting logon`);
        const submitButton = await this.submitButton();
        await submitButton.click();
    }
}

module.exports = LoginPage;
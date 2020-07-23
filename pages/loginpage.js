const consts = require("../modules/consts")
const credentials = require("../.secret/inglogin")

const ID = {
    LOGIN_BOX: "login-input"
};

class LoginPage {

    constructor(browser) {
        this.browser = browser
    }

    async loginTextBox() {
        return await this.browser.getById(ID.LOGIN_BOX);
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
        // Enter login page
        await this.browser.get(consts.LOGIN_HOME_URL);

        // Fill in login name
        const loginBox = await this.loginTextBox();
        await loginBox.sendKeys(credentials.name);
        await loginBox.sendKeys("\n");

        // Fill in password
        let passLetter = null;
        for (let i = 0; i < credentials.password.length; i++) {
            try {
                passLetter = await this.passwordBox(i + 1);
                await passLetter.sendKeys(credentials.password.substr(i, 1));
            } catch (e) {}
        }

        // Agree on coockies
        const cookiesButton = await this.cookiesButton();
        await cookiesButton.click();

        // Submit
        const submitButton = await this.submitButton();
        await submitButton.click();
    }
}

module.exports = LoginPage;
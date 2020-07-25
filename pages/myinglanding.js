const log = require("../modules/log")("App.MyIngLandingPage");

class MyIngLandingPage {

    constructor(browser) {
        this.browser = browser
    }

    async maklerLink() {
        const xpath = "/html//div[@id='layout-region']//header[@id='header-region']//div[@id='tab-list']//span[.='Makler']"
        return await this.browser.getByXPath(xpath);
    }

    async goToMakler() {
        log.info(`Clicking Makler link`);
        const maklerLink = await this.maklerLink();
        await maklerLink.click();
    }
}

module.exports = MyIngLandingPage;
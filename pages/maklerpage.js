const sleep = require('sleep')

class MaklerPage {

    constructor(browser) {
        this.browser = browser
    }

    async marketLink() {
        const xpath = "//div[@r-code='menu.market']"
        return await this.browser.getByXPath(xpath);
    }

    async quotesLink() {
        const xpath = "//div[@r-code='menu.quotations-view']"
        return await this.browser.getByXPath(xpath);
    }

    async dropdown() {
        const xpath = "//div[@class='button-container dropdown-select']";
        return await this.browser.getByXPath(xpath);
    }

    async etfdropdown() {
        const xpath = "//span[@r-code='ETF']";
        return await this.browser.getByXPath(xpath);
    }

    async goToQuotes() {
        // Click Rynek
        console.debug("Click Rynek");
        const marketLink = await this.marketLink();
        await marketLink.click();
        sleep.msleep(250);

        // Click Notowania
        console.debug("Click Notowania");
        const quotesLink = await this.quotesLink();
        await quotesLink.click();
        sleep.msleep(500);

        // Click dropdown
        console.debug("Click Dropdown");
        const dropdown = await this.dropdown();
        await dropdown.click();
        sleep.msleep(250);

        // Scroll down to ETFs
        console.debug("Scroll down to ETFs");
        let script = 'let dropdowns = document.getElementsByClassName("text dropdown-option r-msg"); for (d of dropdowns) { if (d.innerText == "ETF") d.scrollIntoView() }';
        this.browser.js(script);
        sleep.msleep(250);

        // Click ETFs
        console.debug("Click ETFs");
        const etfdropdown = await this.etfdropdown();
        await etfdropdown.click();
    }
}

module.exports = MaklerPage;
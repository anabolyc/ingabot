require('chromedriver');
const { Builder, By, until, Browser, Capability, Capabilities } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { Preferences, Level, Type }  = require('selenium-webdriver/lib/logging')
const consts = require("./consts")


class ChromeBrowser {

    constructor() {
        this.loghandlers = [];
        this.logthreadHandler = null;
        this.driver = null;
    }

    async init() {
        const o = new chrome.Options();
        o.addArguments('disable-infobars');
        o.addArguments('enable-logging');
        o.addArguments('window-size=1024,768');
        // o.addArguments('headless');
        o.setUserPreferences({ 
            credential_enable_service: false 
        });
        o.setPerfLoggingPrefs({
            enableNetwork: true
        });

        const prefs = new Preferences();
        prefs.setLevel(Type.PERFORMANCE, Level.ALL);
        o.setLoggingPrefs(prefs);
        
        this.driver = await new Builder()
            .setChromeOptions(o)
            .forBrowser(Browser.CHROME)
            .build();

        this.logthreadHandler = setInterval(async () => {
            const entries = await this.driver.manage().logs().get(Type.PERFORMANCE);
            entries.forEach(entry => this.loghandlers.forEach(handler => handler(entry)));
        }, 100)
    }

    driver() {
        return this.driver;
    }

    async get(url) {
        return await this.driver.get(url);
    };

    async quit() {
        clearInterval(this.logthreadHandler);
        if (this.driver)
            return await this.driver.quit();
    };

    async getById(id, timeout) {
        await this.driver.wait(until.elementLocated(By.id(id)), timeout || consts.BROWSER_LOCATE_TIMEOUT, `Looking for element by id: ${id}`);
        return await this.driver.findElement(By.id(id));
    };

    async getByXPath(xpath, timeout) {
        await this.driver.wait(until.elementLocated(By.xpath(xpath)), timeout || consts.BROWSER_LOCATE_TIMEOUT, `Looking for element by xpath: ${xpath}`);
        return await this.driver.findElement(By.xpath(xpath));
    };

    js(script) {
        this.driver.executeScript(script);
    }

    subscribe(loghandler) {
        this.loghandlers.push(loghandler);
    }

}

module.exports = ChromeBrowser;
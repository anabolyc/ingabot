require('chromedriver');
const { Builder, By, until, Browser, Capability, Capabilities } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { Preferences, Level, Type, getLogger, addConsoleHandler }  = require('selenium-webdriver/lib/logging')
const consts = require("./consts")

const log = require("./log")("App.ChromeBrowser");

class ChromeBrowser {

    constructor() {
        log.debug("constructor");
        this.loghandlers = [];
        this.logthreadHandler = null;
        this.driver = null;
    }

    async init() {
        log.debug("initialize Driver");
        const o = new chrome.Options();
        o.addArguments('disable-infobars');
        o.addArguments('enable-logging');
        o.addArguments('window-size=1024,768');
        if (process.env.APP_CHROME_HEADLESS)
            o.addArguments('headless');
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

        log.debug("Driver created");
        // this.driver.sendDevToolsCommand("Network.enable");

        this.logthreadHandler = setInterval(async () => {
            const perfEntries = await this.driver.manage().logs().get(Type.PERFORMANCE);
            for (const entry of perfEntries)
                for (const handler of this.loghandlers)
                    await handler(entry);
        }, 100)
    }

    async get(url) {
        log.info(url);
        return await this.driver.get(url);
    };

    async quit() {
        log.info("Stopping Driver");
        if (this.logthreadHandler) {
            log.info("Killing Loggers");
            clearInterval(this.logthreadHandler);
        }
        if (this.driver) {
            log.info("Killing Driver");
            await this.driver.quit();
        }
    };

    async getById(id, timeout) {
        log.debug(`Requesting element by Id: ${id}`);
        await this.driver.wait(until.elementLocated(By.id(id)), timeout || consts.BROWSER_LOCATE_TIMEOUT, `Looking for element by id: ${id}`);
        return await this.driver.findElement(By.id(id));
    };

    async getByXPath(xpath, timeout) {
        log.debug(`Requesting element by XPath: ${xpath}`);
        await this.driver.wait(until.elementLocated(By.xpath(xpath)), timeout || consts.BROWSER_LOCATE_TIMEOUT, `Looking for element by xpath: ${xpath}`);
        return await this.driver.findElement(By.xpath(xpath));
    };

    js(script) {
        log.info(`Executing script: ${script}`);
        this.driver.executeScript(script);
    }

    subscribe(loghandler) {
        log.info("Adding logging subscriber");
        this.loghandlers.push(loghandler);
        log.debug(`\t${this.loghandlers.length} in total`);
    }

}

module.exports = ChromeBrowser;
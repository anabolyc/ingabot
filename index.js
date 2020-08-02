const log = require("./modules/log")("App", true);
log.info(`App is starting: ${__dirname} ${process.argv.join(" ")}`);
log.debug(`${process.platform}, ${process.arch}`);
log.debug(`${process.argv0}, ${process.version}`);

for(let x in process.env) 
{
    log.debug(`\t${x}: ${process.env[x]}`);
}

// ---------------- APP STARTS ----------------

const Browser = require("./modules/chrome");
const browser = new Browser();

const LoginPage = require("./pages/loginpage")
const loginPage = new LoginPage(browser);

const MyIngLandingPage = require("./pages/myinglanding");
const myInglanding = new MyIngLandingPage(browser);

const MaklerPage = require("./pages/maklerpage");
const maklerPage = new MaklerPage(browser);

const Monitor = require("./modules/networkmonitor");
const monitor = new Monitor(browser);

const QuoteStore = require("./modules/quotestore");
const quotestore = new QuoteStore(monitor);

const PopupMonitor = require("./modules/popupmonitor");
const popupmonitor = new PopupMonitor(browser);

// const DictionaryStore = require("./modules/dictionarystore");
// const dictionarystore = new DictionaryStore(monitor);

(async () => {
    try {
        const setIntervalId = setInterval(() => {
            const memusage = process.memoryUsage();
            log.info(`Memory usage: heapTotal = ${Math.round(memusage.heapTotal / 1024 / 1024)} Mb, heapUsed = ${Math.round(memusage.heapUsed / 1024 / 1024)} Mb`);
        }, 600000);

        await browser.init();
        popupmonitor.start();

        await loginPage.login();
        await myInglanding.goToMakler();
        await maklerPage.goToQuotes();

        const pause = (ms) => new Promise(res => setTimeout(res, ms));
        while(true) {
            log.debug("Main loop is running...");
            await pause(600000);
        }

    } catch (e) {
        log.severe(e);
    } finally {
        log.severe("Main loop exited!");
        popupmonitor.stop();

        const datestring = (new Date()).toISOString();
        const path = `./screenshots/${datestring}.png`
        await browser.takeScreenshot(path);
        await browser.quit();
        process.exit();
    }
})();

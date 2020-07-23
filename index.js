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

(async () => {
    try {
        
        await browser.init();
        await loginPage.login();
        await myInglanding.goToMakler();
        await maklerPage.goToQuotes();

        const pause = (ms) => new Promise(res => setTimeout(res, ms));
        while(true) {
            await pause(100);
        }

    } catch (e) {
        console.error(e);
    } finally {
        await browser.quit();
    }

})();

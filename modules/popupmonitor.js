const log = require("./log")("App.PopupMonitor");
const sleep = (ms) => new Promise(res => setTimeout(res, ms));

const WAIT_POPUP_MS = 100;
const REPEAT_MS = 150;

class PopupMonitor {

    constructor(browser) {
        this.browser = browser
    }

    async popup() {
        const xpath = "//submit-button[@class='priority-message-dialog']"
        return await this.browser.getByXPath(xpath, WAIT_POPUP_MS, true);
    }

    start() {
        this.intervalId = setInterval(async () => {
            try {
                const popup = await this.popup();    
                await popup.click();    
            } catch (e) {}
        }, REPEAT_MS);
    }

    stop() {
        clearInterval(this.intervalId);
        this.intervalId = null;
    }

}

module.exports = PopupMonitor;
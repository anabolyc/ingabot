const log = require("./log")("App.NetworkMonitor");

const subscribers = [];
let _browser = null;

class NetworkMonitor {

    constructor(browser) {
        _browser = browser;
        browser.subscribe(this.loghandler)
    }

    driver() {
        return _browser.driver;
    }

    async loghandler(entry) {
        const msg = JSON.parse(entry.message);
        for (const handler of subscribers)
            await handler(msg.message);
    }

    subscribe(handler) {
        log.info("Adding network logging subscriber");
        subscribers.push(handler);
        log.debug(`\t${subscribers.length} in total`);
    }
    
}

module.exports = NetworkMonitor;
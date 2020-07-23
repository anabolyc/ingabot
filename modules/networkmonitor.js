class Monitor {

    constructor(browser) {
        browser.subscribe(this.loghandler)
    }

    loghandler(entry) {
        const msg = JSON.parse(entry.message);
        if (msg.message.method.startsWith("Network.webSocketFrameReceived")) 
        {
            console.log(`${msg.message.method} ${msg.message.params.response.payloadData}`);
        }
    }
}

module.exports = Monitor;
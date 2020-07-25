const Db = require("./db");
const db = new Db();

let _monitor = null;

class DictionaryStore {

    constructor(monitor) {
        _monitor = monitor;
        monitor.subscribe(this.loghandler);
    }

    async loghandler(message) {
        // if (message.method != "Network.responseReceived")
        //     return;
        if (!message.method.startsWith("Network."))
            return;

        console.debug(`${message.method} ${message.params.requestId}`);

        // if (message.method.startsWith("Network.dataReceived"))
        //     console.debug(message.params);

        if (message.method.startsWith("Network.loadingFinished"))
        {
            //console.debug(message.params);
            //const requestId = ;
            const result = await _monitor.driver().sendDevToolsCommand("Network.getResponseBody", { requestId: message.params.requestId });
            console.log(`\t${result}`);
        }

        if (!message.params.response)
            return;

        console.debug(`\t${message.params.response.url}`);

        if (message.params.response.url != "https://makler.ingbank.pl/ciiapi/dictionaries")
            return;
        
            // const rows = await db.query('SELECT curdate() as `date`;');
        // console.debug(rows[0].date);

        //console.debug(message.method, message.params.response.url);
        //if (message.params.response.url.indexOf('dict') > -1)
        //    console.debug(message.params);
        // const entry = JSON.parse(message.params.response.payloadData);
        // console.debug("QuoteStore.loghandler", entry);

        // if (entry.sc != 0 && entry.cg == "Q") {
        //     const data = entry.data;
        //     console.debug(`${entry.sc} ${data[0]}`);
        //     console.debug(`SELL: ${data[9]} x ${data[6]}`);
        //     console.debug(`SELL: ${data[10]} x ${data[7]}`);
        //     console.debug(`SELL: ${data[11]} x ${data[8]}`);
        //     console.debug(`BUY : ${data[15]} x ${data[12]}`);
        //     console.debug(`BUY : ${data[16]} x ${data[13]}`);
        //     console.debug(`BUY : ${data[17]} x ${data[14]}`);
        // }
        
    }
}

module.exports = DictionaryStore;
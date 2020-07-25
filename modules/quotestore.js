const Db = require("./db");
const db = new Db();

const log = require("./log")("App.QuoteStore");

class QuoteStore {

    constructor(monitor) {
        monitor.subscribe(this.loghandler);
    }

    async loghandler(message) {
        if (message.method != "Network.webSocketFrameReceived")
            return;

        const entry = JSON.parse(message.params.response.payloadData);
        log.info(`Captured quote: ${entry.sc}`)

        if (entry.sc != 0 && entry.cg == "Q") {
            const data = entry.data;
            const emptycheck = (x) => { return x == '' ? null : x; }
            const row = {
                instrument_id: entry.sc,
                date: data[0],
                sell_price_0: emptycheck(data[9]),
                sell_price_1: emptycheck(data[10]),
                sell_price_2: emptycheck(data[11]),
                sell_volume_0: emptycheck(data[6]),
                sell_volume_1: emptycheck(data[7]),
                sell_volume_2: emptycheck(data[8]),
                buy_price_0: emptycheck(data[12]),
                buy_price_1: emptycheck(data[13]),
                buy_price_2: emptycheck(data[14]),
                buy_volume_0: emptycheck(data[15]),
                buy_volume_1: emptycheck(data[16]),
                buy_volume_2: emptycheck(data[17]),
                mkt_price: emptycheck(data[18]),
                mkt_volume: emptycheck(data[19])
            };

            log.info(`\t${data[0]} SELL ${data[6]} x ${data[9]} | ${data[12]} x ${data[15]} BUY`)
            
            await db.query('INSERT INTO `quotes` SET ?', row);

            //console.debug(`SELL: ${data[9]} x ${data[6]}`);
            //console.debug(`SELL: ${data[10]} x ${data[7]}`);
            //console.debug(`SELL: ${data[11]} x ${data[8]}`);
            //console.debug(`BUY : ${data[12]} x ${data[15]}`);
            //console.debug(`BUY : ${data[13]} x ${data[16]}`);
            //console.debug(`BUY : ${data[14]} x ${data[17]}`);
            //console.debug(`PRC : ${data[18]} x ${data[19]}`);
        }
        
    }
}

module.exports = QuoteStore;
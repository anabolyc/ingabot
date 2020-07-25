const credentials = require(process.env.APP_MYSQL_CRED_PATH || "../.secret/mysql");
const mysql       = require('mysql2');

const log = require("./log")("App.Db");

class Db {

    constructor() {
        const config = {
            host     : credentials.host,
            port     : credentials.port,
            user     : credentials.username,
            password : credentials.password,
            database : credentials.dbname
        };

        log.info(`Creating pool for ${credentials.username}@${credentials.host}:${credentials.port}/${credentials.dbname}`)
        this.pool = mysql.createPool(config);
    }

    async query(sql, arg) {
        log.debug(`Running query: ${sql}`);
        const promisePool = this.pool.promise();
        const [rows] = await promisePool.query(sql, arg);
        return rows;
    }

}

module.exports = Db;
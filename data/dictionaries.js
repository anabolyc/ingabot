const data = require("./dictionaries.json");
const Db = require("../modules/db");
const db = new Db();

class DictionariesUploader {

    constructor() {

    }

    async upload() {
        const instruments = data.data.filter(x => x.name == "instruments")[0];
        for (const inst of instruments.elements) {
            console.log(inst);
            await db.query('INSERT INTO `instruments` SET ?', inst);
        }
    }

};

module.exports = DictionariesUploader;
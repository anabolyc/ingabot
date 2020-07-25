const Dictionaries = require("./data/dictionaries");
const dictionaries = new Dictionaries();

(async () => {
    await dictionaries.upload();
})();

return;
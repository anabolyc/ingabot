const { Level, getLogger, addConsoleHandler }  = require('selenium-webdriver/lib/logging')

module.exports = (name, withConsole, level) => {
    const log = getLogger(name);
    log.setLevel(level || Level.ALL);
    if (withConsole)
        addConsoleHandler(log);
    return log;
};
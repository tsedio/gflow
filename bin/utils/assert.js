const commander = require("commander");
const chalk = require("chalk");

module.exports = {
  assert(test, msg) {
    if (test) {
      console.error(chalk.red(msg));
      commander.outputHelp(o => chalk.red(o));
      process.exit(0);
    }
  }
};

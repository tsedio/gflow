const chalk = require("chalk");
const Listr = require("listr");
const refreshRepository = require("./refresh-repository");

module.exports = {
  getOptions(options = {}) {
    return {
      ...options,
      output: []
    };
  },

  getTasks(options) {
    return new Listr([refreshRepository(options)]);
  },

  async fetch(options) {
    try {
      options = module.exports.getOptions(options);

      await module.exports.getTasks(options).run();
      console.log(options.output.filter(l => !l.match("Fetching")).join("\n"));
    } catch (err) {
      console.error(chalk.red(String(err.all || err)));
    }
  }
};

/* eslint-disable global-require */
const Listr = require("listr");
const chalk = require("chalk");
const figures = require("figures");
const { getRebaseInfo } = require("../utils/get-rebase-info");
const runRefreshRepository = require("./refresh-repository");
const runRebaseBranch = require("./rebase-branch");
const runInstall = require("./install");

const DEFAULT_OPTIONS = {
  test: false,
  force: false,
  fromBranch: undefined
};

module.exports = {
  /**
   *
   * @param options
   * @returns {{fromBranch: *, featureBranch: *}}
   */
  getOptions(options = {}) {
    options = { ...DEFAULT_OPTIONS, ...options };

    return {
      ...options,
      ...getRebaseInfo(options.fromBranch)
    };
  },

  getTasks(options) {
    return new Listr([
      runRefreshRepository(),
      runRebaseBranch({ ...options, checkStatus: false }),
      runInstall(options)
    ]);
  },

  async rebaseBranch(options) {
    try {
      options = module.exports.getOptions(options);

      await this.getTasks(options).run();
      console.log(
        chalk.green(figures.tick),
        `Branch ${chalk.green(
          options.featureBranch
        )} rebased from ${chalk.green(options.fromBranch)} HEAD`
      );
    } catch (err) {
      console.error(chalk.red(String(err.all || err)));
    }
  }
};

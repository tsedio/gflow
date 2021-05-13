const Listr = require("listr");
const chalk = require("chalk");
const figures = require("figures");
const config = require("../config");
const { getRebaseInfo } = require("../utils/get-rebase-info");
const runInstall = require("./install/index");
const runTest = require("./test/index");
const runRefreshRepository = require("./refresh-repository");
const runPrepareWorkspace = require("./prepare-workspace");
const runPushBranch = require("./push-branch");

const DEFAULT_OPTIONS = {
  test: true,
  force: false
};

module.exports = {
  DEFAULT_OPTIONS,
  /**
   *
   * @param options
   * @returns {{rebase: boolean}}
   */
  getOptions(options = {}) {
    options = { ...DEFAULT_OPTIONS, ...options };

    return {
      ...options,
      ...getRebaseInfo(options.fromBranch),
      rebase: false
    };
  },
  /**
   *
   * @param options
   * @returns {Listr}
   */
  getTasks(options) {
    return new Listr(
      [
        runRefreshRepository(),
        runPrepareWorkspace(options),
        runInstall(options),
        runTest(options),
        runPushBranch({
          ...options,
          force: true,
          noVerify: true,
          upstream: true
        })
      ],
      {}
    );
  },
  /**
   *
   * @param options
   * @returns {Promise<void>}
   */
  async mergeBranch(options) {
    try {
      options = module.exports.getOptions(options);

      if (options.featureBranch === config.production) {
        console.error(
          chalk.red(`${figures.cross} ${config.production} cannot be merged`)
        );
        return;
      }

      await module.exports.getTasks(options).run();
      console.log(
        chalk.green(figures.tick),
        "Branch",
        chalk.green(options.featureBranch),
        " is merged"
      );
    } catch (err) {
      console.error(chalk.red(String(err.all || err)));
    }
  }
};

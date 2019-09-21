/* eslint-disable global-require */
const Listr = require('listr');
const chalk = require('chalk');
const figures = require('figures');
const config = require('../config');
const { getRebaseInfo } = require('../utils/get-rebase-info');
const runRefreshRepository = require('./refresh-repository');
const runInstall = require('./install');
const runTest = require('./test');
const runRebaseBranch = require('./rebase-branch');
const runPushBranch = require('./push-branch');

const DEFAULT_OPTIONS = {
  checkStatus: true,
  force: false,
  fromBranch: undefined,
  test: !config.skipTest,
  rebase: config.flow === 'gflow'
};

module.exports = {
  DEFAULT_OPTIONS,
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
  /**
   *
   * @param options
   * @returns {Listr}
   */
  getTasks(options) {
    return new Listr([
      runRefreshRepository(),
      runRebaseBranch(options),
      runInstall(options),
      runTest(options),
      runPushBranch({ ...options, upstream: true, noVerify: true, force: true })
    ]);
  },

  async pushBranch(options) {
    try {
      options = module.exports.getOptions(options);
      await module.exports.getTasks(options).run();
      console.log(chalk.green(figures.tick), 'Branch', chalk.green(options.featureBranch), 'rebased and pushed.');
    } catch (err) {
      console.error(chalk.red(String(err.all || err)));
    }
  }
};

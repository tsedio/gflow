const Listr = require('listr');
const chalk = require('chalk');
const figures = require('figures');
const execa = require('execa');
const Sync = require('./sync');
const config = require('../config');
const { getRebaseInfo } = require('../utils/get-rebase-info');
const runInstall = require('./install');
const runTest = require('./test/index');
const runRefreshRepository = require('./refresh-repository');
const runPrepareWorkspace = require('./prepare-workspace');
const runPushAndClean = require('./push-and-clean');
const runRebaseBranch = require('./rebase-branch');

const DEFAULT_OPTIONS = {
  test: true
};

module.exports = {
  getOptions(options = {}) {
    options = { ...DEFAULT_OPTIONS, ...options };

    return {
      ...options,
      ...getRebaseInfo(options.fromBranch),
      rebase: true
    };
  },

  getTasks(options) {
    return new Listr(
      [
        runRefreshRepository(),
        runRebaseBranch({ ...options, checkStatus: false }),
        runInstall(options),
        runTest(options),
        runPrepareWorkspace(options),
        runPushAndClean(options)
      ],
      {}
    );
  },

  async finishBranch(options) {
    try {
      options = module.exports.getOptions(options);

      // Can't finish a production branch
      if (options.featureBranch === config.production) {
        console.error(chalk.red(`${figures.cross} ${config.production} cannot be finished`));
        return;
      }

      await module.exports.getTasks(options).run();

      console.log(chalk.green(figures.tick), 'Branch', chalk.green(options.featureBranch), ' is finished');

      if (config.postFinish) {
        await execa.shell(config.postFinish, { stdio: ['inherit', 'inherit', 'inherit'] });
      }

      if (config.syncAfterFinish) {
        await Sync.syncBranches();
      }
    } catch (err) {
      console.error(chalk.red(String(err)));
    }
  }
};

/* eslint-disable global-require */

const Listr = require('listr');
const chalk = require('chalk');
const figures = require('figures');
const config = require('../config/index');
const git = require('../git/index');
const { normalizeBranchName } = require('../utils/normalize-branch');
const { commitConfig } = require('../config/commit-config');

const DEFAULT_OPTIONS = {
  branchName: 'branch_name',
  type: 'feat'
};

function runInteractive(options = DEFAULT_OPTIONS) {
  const from = options.fromBranch;
  const branchName = normalizeBranchName(options.branchName, options.type);

  config.refs.set(branchName, options.fromBranch);

  const tasks = new Listr([
    {
      title: 'Refresh local repository',
      task: () => git.refreshRepository()
    },
    {
      title: `Create branch from ${chalk.green(from)}`,
      task: () => git.checkout('--no-track', '-b', branchName, from)
    },
    {
      title: `Update refs ${chalk.green(from)}`,
      task: () => commitConfig()
    },

    require('../install/index')(options)
  ]);

  return tasks
    .run()
    .then(() => {
      console.log(chalk.green(figures.tick), `New branch ${chalk.green(branchName)} created from ${chalk.green(from)} HEAD`);
    })
    .catch(err => {
      console.error(chalk.red(String(err)));
    });
}

module.exports = runInteractive;

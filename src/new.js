'use strict';
const Listr = require('listr');
const chalk = require('chalk');
const figures = require('figures');
const utils = require('./utils');
const { refreshRepository, checkout } = require('./git/index');

const DEFAULT_OPTIONS = {
  branchName: 'branch_name',
  type: 'feat'
};

function runInteractive(options = DEFAULT_OPTIONS) {
  const from = options.fromBranch;
  const branchName = utils.normalizeBranchName(options.branchName, options.type);

  const tasks = new Listr([
    {
      title: 'Refresh local repository',
      task: () => refreshRepository()
    },
    {
      title: `Create branch from ${chalk.green(from)}`,
      task: () => checkout('--no-track', '-b', branchName, from)
    },
    require('./install')(options)
  ]);

  return tasks
    .run()
    .then(() => {

      config.setBranchRef(branchName, from);

      console.log(chalk.green(figures.tick), `New branch ${branchName} created from ${from} HEAD`);
    })
    .catch(err => {
      console.error(chalk.red(String(err)));
    });
}

module.exports = runInteractive;
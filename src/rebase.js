'use strict';
const Listr = require('listr');
const chalk = require('chalk');
const figures = require('figures');
const { config } = require('../src/config');
const { refreshRepository, rebase, currentBranchName } = require('./git/index');

module.exports = (options) => {
  const fromBranch = options.fromBranch || config.remoteProduction;
  const tasks = new Listr([
    {
      title: 'Refresh local repository',
      task: () => refreshRepository()
    },
    {
      title: `Rebase current branch from ${chalk.green(fromBranch)}`,
      task: () => rebase(fromBranch)
    },
    require('./install')(options)
  ]);

  return tasks
    .run()
    .then(() => {
      console.log(chalk.green(figures.tick), 'Branch', currentBranchName(), `rebased from ${fromBranch} HEAD`);
    })
    .catch(err => {
      console.error(chalk.red(String(err)));
    });
};


'use strict';
const Listr = require('listr');
const chalk = require('chalk');
const figures = require('figures');
const config = require('./config');
const { refreshRepository, push, remote, rebase, currentBranchName, branchExists, checkBranchRemoteStatus } = require('./git');

const DEFAULT_OPTIONS = {
  test: false,
  force: false,
  fromBranch: undefined
};

/**
 *
 * @param options
 * @returns {*}
 */
function doCheck(options) {

  const isBranchExists = branchExists(options.featureBranch);

  if (isBranchExists && !options.force) {
    return checkBranchRemoteStatus(options.featureBranch)
      .then((result) => options)
      .catch((er) => {
        throw new Error('Remote branch did not changed');
      });

  }
  return Promise.resolve(options);
}

/**
 *
 * @param options
 */
function runInteractive(options = DEFAULT_OPTIONS) {
  const featureBranch = currentBranchName();
  const fromBranch = options.fromBranch || config.remoteProduction;
  const devBranch = (options.devBranch || config.remoteDevelop).split('/')[1];

  const tasks = new Listr([
    {
      title: 'Refresh local repository',
      task: () => {
        return new Listr([
          {
            title: 'Remote',
            task: () => remote('-v')
          },
          {
            title: 'Fetch',
            task: () => refreshRepository()
          },
          {
            title: 'Synchronize',
            task: () => push('-f', config.remote, 'refs/remotes/' + fromBranch + ':refs/heads/' + devBranch)
          },
          {
            title: 'Check status',
            task: () => doCheck(options)
          },
          {
            title: `Rebase from ${chalk.green(fromBranch)}`,
            task: () => rebase(fromBranch)
          }
        ], { concurrent: false });
      }
    },
    require('./install')(options),
    require('./test')(options),
    {
      title: 'Push',
      task: () => push('-u', '-f', config.remote, featureBranch)
    }
  ]);

  return tasks
    .run()
    .then(() => {
      console.log(chalk.green(figures.tick), 'Branch', featureBranch, 'rebased and pushed.');
    })
    .catch(err => {
      console.error(String(err));
      return Promise.resolve();
    });
}

module.exports = runInteractive;
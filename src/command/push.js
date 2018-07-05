/* eslint-disable global-require */
const Listr = require('listr');
const chalk = require('chalk');
const figures = require('figures');
const config = require('../config/index');
const git = require('../git/index');
const { getRebaseInfo } = require('../utils/get-rebase-info');
const { cleanRefs } = require('../config/clean-refs');

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
  const isBranchExists = git.branchExists(options.branch, config.remote);

  if (isBranchExists && !options.force) {
    const result = git.checkBranchRemoteStatusSync(options.branch);
    return result ? Promise.resolve(options) : Promise.reject(new Error('Remote branch changed, check diff before continue'));
  }
  return Promise.resolve(options);
}

/**
 *
 * @param options
 */
function runInteractive(options = DEFAULT_OPTIONS) {
  cleanRefs();

  const { branch, fromBranch } = getRebaseInfo(options.fromBranch);

  const tasks = new Listr([
    {
      title: 'Refresh local repository',
      task: () =>
        new Listr(
          [
            {
              title: 'Remote',
              task: () => git.remote('-v')
            },
            {
              title: 'Fetch',
              task: () => git.refreshRepository()
            },
            {
              title: 'Check status',
              task: () => doCheck({ force: options.force, branch })
            },
            {
              title: `Rebase from ${chalk.green(fromBranch)}`,
              task: () => git.rebase(fromBranch)
            }
          ],
          { concurrent: false }
        )
    },
    require('../install/index')(options),
    require('../test/index')(options),
    {
      title: 'Push',
      task: () => git.push('-u', '-f', config.remote, branch, '--no-verify')
    }
  ]);

  return tasks
    .run()
    .then(() => {
      console.log(chalk.green(figures.tick), 'Branch', chalk.green(branch), 'rebased and pushed.');
    })
    .catch(err => {
      console.error(String(err));
      return Promise.resolve();
    });
}

module.exports = runInteractive;

const Listr = require('listr');

/* eslint-disable global-require */
const chalk = require('chalk');
const figures = require('figures');
const execa = require('execa');
const sync = require('./sync');
const config = require('../config');
const git = require('../git');
const { getBranchName } = require('../utils/get-branche-name');
const { getRebaseInfo } = require('../utils/get-rebase-info');

const DEFAULT_OPTIONS = {
  test: true
};

function runInteractive(options = {}) {
  options = Object.assign({}, DEFAULT_OPTIONS, options);

  const { branch: featureBranch, fromBranch } = getRebaseInfo(options.fromBranch);
  const fromLocalBranch = getBranchName(fromBranch);

  // Can't finish a production branch
  if (featureBranch === config.production) {
    console.error(chalk.red(`${figures.cross} ${config.production} cannot be finished`));
    return Promise.resolve();
  }

  const tasks = new Listr(
    [
      {
        title: 'Refresh local repository',
        task: () => git.refreshRepository()
      },
      {
        title: 'Rebase and prepare workspace',
        task: () =>
          new Listr(
            [
              {
                title: `Rebase ${chalk.green(featureBranch)} from ${chalk.green(fromBranch)}`,
                task: () => git.rebase(fromBranch)
              },
              {
                title: `Delete locale branch ${chalk.green(fromLocalBranch)}`,
                task: (ctx, task) =>
                  git.branch('-D', fromLocalBranch).catch(() => {
                    task.skip(`Local branch ${chalk.green(fromLocalBranch)} not found`);
                    return Promise.resolve();
                  })
              },
              {
                title: `Checkout branch ${chalk.green(fromLocalBranch)}`,
                task: () => git.checkout('-b', fromLocalBranch, fromBranch)
              },
              {
                title: `Merging branch ${chalk.green(featureBranch)}`,
                task: () => git.merge('--no-ff', '-m', `Merge ${featureBranch}`, featureBranch)
              }
            ],
            { concurrency: false }
          )
      },
      require('../install/index')(options),
      require('../test/index')(options),
      {
        title: 'Push',
        task: () =>
          new Listr(
            [
              {
                title: `Push ${fromLocalBranch}`,
                task: () => git.push(config.remote, fromLocalBranch, '--no-verify')
              }
            ],
            { concurrency: false }
          )
      }
    ],
    {}
  );

  return tasks
    .run()
    .then(() => {
      console.log(chalk.green(figures.tick), 'Branch', chalk.green(featureBranch), ' is finished');
    })
    .catch(err => {
      console.error(String(err));
      return Promise.resolve();
    });
}

module.exports = runInteractive;

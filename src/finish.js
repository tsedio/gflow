'use strict';
const Listr = require('listr');
const chalk = require('chalk');
const figures = require('figures');
const sync = require('./sync');
const config = require('./config');
const { refreshRepository, currentBranchName, branch, checkout, merge, push, rebase } = require('./git/index');

const DEFAULT_OPTIONS = {
  test: true
};

function runInteractive(options = {}) {
  options = Object.assign({}, DEFAULT_OPTIONS, options);
  const currentBranch = currentBranchName();

  const tasks = new Listr([
    {
      title: 'Refresh local repository',
      task: () => refreshRepository()
    },
    {
      title: 'Rebase and prepare workspace',
      task: () => new Listr([
        {
          title: `Rebase ${currentBranch} from ${config.remoteProduction}`,
          task: () => rebase(config.remoteProduction)
        },
        {
          title: `Delete locale branch ${config.production}`,
          task: (ctx, task) => branch('-D', config.production)
            .catch(() => {
              task.skip(`Local branch ${config.production} not found`);
              return Promise.resolve();
            })
        },
        {
          title: `Checkout branch ${config.production}`,
          task: (ctx, task) => checkout('-b', config.production, config.remoteProduction)
        },
        {
          title: `Merging branch ${currentBranch}`,
          task: () => merge('--no-ff', '-m', `Merge ${currentBranch}`, currentBranch)
        }
      ], { concurrency: false })
    },
    require('./install')(options),
    require('./test')(options),
    {
      title: `Push`,
      task: () =>
        new Listr([
          {
            title: `${config.develop}`,
            enabled: () => currentBranch === config.develop,
            task: () => push(config.remote, config.develop)
          },
          {
            title: `${config.production}`,
            task: () => push(config.remote, config.production)
          },
          {
            title: `Remove branch origin/${currentBranch}`,
            enabled: () => currentBranch !== config.develop,
            task: () => push(config.remote, `:${currentBranch}`)
          },
          {
            title: `Remove branch ${currentBranch}`,
            enabled: () => currentBranch !== config.develop,
            task: () => branch('-d', currentBranch)
          },

          {
            title: `Post finish ${config.postFinish}`,
            enabled: () => config.postFinish !== '',
            task: () => exec(config.postFinish)
          }
        ], { concurrency: false })
    }
  ], {});

  return tasks
    .run()
    .then(() => {
      console.log(chalk.green(figures.tick), 'Branch', currentBranch, ' is finished');

      if (config.syncAfterFinish) {
        return sync();
      }

    })
    .catch(err => {
      console.error(String(err));
      return Promise.resolve();
    });
}

module.exports = runInteractive;


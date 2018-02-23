'use strict';
const Listr = require('listr');
const chalk = require('chalk');
const figures = require('figures');

const hasYarn = require('has-yarn');
const { refreshRepository, egit, branch, checkout, push } = require('./git/index');

const DEFAULT_OPTIONS = {
  master: 'master',
  production: 'production',
  yarn: hasYarn()
};

function runInteractive(options = {}) {
  options = Object.assign({}, DEFAULT_OPTIONS, options);

  const tasks = new Listr([
    {
      title: 'Refresh local repository',
      task: () => refreshRepository()
    },
    {
      title: 'Synchronize',
      task: () => new Listr([
        {
          title: `Checkout branch ${options.master}`,
          task: (ctx, task) => checkout('-b', options.master, `origin/${options.master}`)
            .catch(() => {
              task.skip(`Local branch ${options.master} exists`);
              return Promise.resolve();
            })

        },
        {
          title: `Checkout branch ${options.master}`,
          task: (ctx, task) => checkout(options.master)
            .catch(() => {
              task.skip(`Already on branch ${options.master}`);
              return Promise.resolve();
            })
        },
        {
          title: `Delete locale branch ${options.production}`,
          task: (ctx, task) => branch('-D', options.production)
            .catch(() => {
              task.skip(`Local branch ${options.production} not found`);
              return Promise.resolve();
            })
        },
        {
          title: `Checkout branch ${options.production}`,
          task: (ctx, task) => checkout('-b', options.production, `origin/${options.production}`)
        },
        {
          title: `Checkout branch ${options.master}`,
          task: (ctx, task) => checkout(options.master)
            .catch(() => {
              task.skip(`Already on branch ${options.master}`);
              return Promise.resolve();
            })
        },
        {
          title: `Reset hard ${options.master}`,
          task: () => egit('reset', '--hard', `refs/heads/${options.production}`)
        },
        {
          title: `Push ${options.master}`,
          task: (ctx, task) => push('-f', 'origin', options.master)
        }
      ], { concurrency: false })
    }
  ]);

  return tasks
    .run()
    .then(() => {
      console.log(chalk.green(figures.tick), 'Branch', options.master, 'synchronized with', options.production);
    })
    .catch(err => {
      console.error(chalk.red(String(err)));
    });
}

module.exports = runInteractive;


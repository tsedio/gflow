const Listr = require('listr');
const chalk = require('chalk');
const figures = require('figures');
const config = require('../config');
const git = require('../git/index');

function runInteractive() {
  const tasks = new Listr([
    {
      title: 'Refresh local repository',
      task: () => git.refreshRepository()
    },
    {
      title: 'Synchronize',
      task: () =>
        new Listr(
          [
            {
              title: `Checkout branch ${config.develop}`,
              task: (ctx, task) =>
                git.checkout('-b', config.develop, `origin/${config.develop}`).catch(() => {
                  task.skip(`Local branch ${config.develop} exists`);
                  return Promise.resolve();
                })
            },
            {
              title: `Checkout branch ${config.develop}`,
              task: (ctx, task) =>
                git.checkout(config.develop).catch(() => {
                  task.skip(`Already on branch ${config.develop}`);
                  return Promise.resolve();
                })
            },
            {
              title: `Delete locale branch ${config.production}`,
              task: (ctx, task) =>
                git.branch('-D', config.production).catch(() => {
                  task.skip(`Local branch ${config.production} not found`);
                  return Promise.resolve();
                })
            },
            {
              title: `Checkout branch ${config.production}`,
              task: () => git.checkout('-b', config.production, config.remoteProduction)
            },
            {
              title: `Checkout branch ${config.develop}`,
              task: (ctx, task) =>
                git.checkout(config.develop).catch(() => {
                  task.skip(`Already on branch ${config.develop}`);
                  return Promise.resolve();
                })
            },
            {
              title: `Reset hard ${config.develop}`,
              task: () => git.reset('--hard', `refs/heads/${config.production}`)
            },
            {
              title: `Push ${config.develop}`,
              task: () => git.push('-f', config.remote, config.develop)
            }
          ],
          { concurrency: false }
        )
    }
  ]);

  return tasks
    .run()
    .then(() => {
      console.log(chalk.green(figures.tick), 'Branch', config.develop, 'synchronized with', config.production);
    })
    .catch(err => {
      console.error(chalk.red(String(err)));
    });
}

module.exports = runInteractive;

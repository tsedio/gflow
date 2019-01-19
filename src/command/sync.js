const Listr = require('listr');
const chalk = require('chalk');
const figures = require('figures');
const { catchError } = require('rxjs/operators');
const { of } = require('rxjs');
const config = require('../config');
const git = require('../git/index');
const refreshRepository = require('./refresh-repository');
const runPushBranch = require('./push-branch');

module.exports = {
  getTasks() {
    return new Listr([
      refreshRepository(),
      {
        title: 'Synchronize',
        task: () => new Listr(
          [
            {
              title: `Checkout branch ${config.develop}`,
              task: (ctx, task) => git.checkout('-b', config.develop, `${config.remote}/${config.develop}`)
                .pipe(catchError(() => {
                  task.skip(`Local branch ${config.develop} exists`);
                  return of(undefined);
                }))
            },
            {
              title: `Checkout branch ${config.develop}`,
              task: (ctx, task) => git.checkout(config.develop)
                .pipe(catchError(() => {
                  task.skip(`Already on branch ${config.develop}`);
                  return of(undefined);
                }))
            },
            {
              title: `Delete locale branch ${config.production}`,
              task: (ctx, task) => git.branch('-D', config.production)
                .pipe(catchError(() => {
                  task.skip(`Local branch ${config.production} not found`);
                  return of(undefined);
                }))
            },
            {
              title: `Checkout branch ${config.production}`,
              task: () => git.checkout('-b', config.production, config.remoteProduction)
            },
            {
              title: `Checkout branch ${config.develop}`,
              task: (ctx, task) => git.checkout(config.develop)
                .pipe(catchError(() => {
                  task.skip(`Already on branch ${config.develop}`);
                  return of(undefined);
                }))
            },
            {
              title: `Reset hard ${config.develop}`,
              task: () => git.reset('--hard', `refs/heads/${config.production}`)
            },

            runPushBranch({ featureBranch: config.develop, force: true })
          ],
          { concurrency: false }
        )
      }
    ]);
  },

  async syncBranches() {
    try {
      await module.exports.getTasks().run();
      console.log(chalk.green(figures.tick), 'Branch', config.develop, 'synchronized with', config.production);
    } catch (err) {
      console.error(chalk.red(String(err)));
    }
  }
};

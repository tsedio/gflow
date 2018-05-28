'use strict';
const Listr = require('listr');
const chalk = require('chalk');
const figures = require('figures');
const sync = require('./sync');
const config = require('./config');
const exec = require('./exec');
const execa = require('execa');
const { refreshRepository, currentBranchName, branch, checkout, merge, push, rebase } = require('./git/index');

const DEFAULT_OPTIONS = {
  test: true,
  fromBranch: config.remoteProduction,
  devBranch: config.remoteDevelop
};

function runInteractive(options = {}) {
  options = Object.assign({}, DEFAULT_OPTIONS, options);
  const featureBranch = currentBranchName();
  const fromRemoteBranch = options.fromBranch;
  const fromLocalBranch = fromRemoteBranch.split('/')[1];
  const devRemoteBranch = options.devBranch;
  const devLocalBranch = devRemoteBranch.split('/')[1];

  const isEnabled = featureBranch === devLocalBranch && devLocalBranch !== devLocalBranch;

  const tasks = new Listr([
    {
      title: 'Refresh local repository',
      task: () => refreshRepository()
    },
    {
      title: 'Rebase and prepare workspace',
      task: () => new Listr([
        {
          title: `Rebase ${featureBranch} from ${fromRemoteBranch}`,
          task: () => rebase(fromRemoteBranch)
        },
        {
          title: `Delete locale branch ${fromLocalBranch}`,
          task: (ctx, task) => branch('-D', fromLocalBranch)
            .catch(() => {
              task.skip(`Local branch ${fromLocalBranch} not found`);
              return Promise.resolve();
            })
        },
        {
          title: `Checkout branch ${fromLocalBranch}`,
          task: (ctx, task) => checkout('-b', fromLocalBranch, fromRemoteBranch)
        },
        {
          title: `Merging branch ${featureBranch}`,
          task: () => merge('--no-ff', '-m', `Merge ${featureBranch}`, featureBranch)
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
            title: `${devLocalBranch}`,
            enabled: isEnabled,
            task: () => push(config.remote, devLocalBranch)
          },
          {
            title: `${fromLocalBranch}`,
            task: () => push(config.remote, fromLocalBranch)
          },
          {
            title: `Remove branch origin/${featureBranch}`,
            enabled: isEnabled,
            task: () => push(config.remote, `:${featureBranch}`)
          },
          {
            title: `Remove branch ${featureBranch}`,
            enabled: isEnabled,
            task: () => branch('-d', featureBranch)
          }
        ], { concurrency: false })
    }
  ], {});

  return tasks
    .run()
    .then(() => {
      console.log(chalk.green(figures.tick), 'Branch', featureBranch, ' is finished');
    })
    .then(() => {
      if (config.postFinish) {
        return execa.shell(config.postFinish, { stdio: ['inherit', 'inherit', 'inherit'] });
      }
    })
    .then(() => {
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


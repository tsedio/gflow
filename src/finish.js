'use strict';
const Listr = require('listr');
const chalk = require('chalk');
const figures = require('figures');
const sync = require('./sync');
const cleanRefs = require('./clean-refs');
const { getBranchName } = require('./utils');
const { getRebaseInfo } = require('./utils/get-rebase-info');
const config = require('./config');
const exec = require('./exec');
const execa = require('execa');
const { refreshRepository, branchExists, checkout, branch, merge, push, rebase, addSync, commit } = require('./git/index');

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

  const removeRemoteBranch = () => branchExists(featureBranch, config.remote) && featureBranch !== config.develop;
  const removeBranch = () => featureBranch !== config.develop && featureBranch !== config.production;

  /*
  console.log('featureBranch', featureBranch);
  console.log('fromBranch', fromBranch);
  console.log('featureBranch will be removed (origin) ?', removeRemoteBranch());
  console.log('featureBranch will be removed (locale) ?', removeBranch());

  return Promise.resolve(); */

  const tasks = new Listr([
    {
      title: 'Refresh local repository',
      task: () => refreshRepository()
    },
    {
      title: 'Rebase and prepare workspace',
      task: () => new Listr([
        {
          title: `Rebase ${chalk.green(featureBranch)} from ${chalk.green(fromBranch)}`,
          task: () => rebase(fromBranch)
        },
        {
          title: 'Clean references configuration',
          task: () => {
            config.refs.delete(featureBranch);
            cleanRefs();

            addSync('.gflowrc');
            return commit('--amend', '--no-edit');
          }
        },
        {
          title: `Delete locale branch ${chalk.green(fromLocalBranch)}`,
          task: (ctx, task) => branch('-D', fromLocalBranch)
            .catch(() => {
              task.skip(`Local branch ${chalk.green(fromLocalBranch)} not found`);
              return Promise.resolve();
            })
        },
        {
          title: `Checkout branch ${chalk.green(fromLocalBranch)}`,
          task: (ctx, task) => checkout('-b', fromLocalBranch, fromBranch)
        },
        {
          title: `Merging branch ${chalk.green(featureBranch)}`,
          task: () => merge('--no-ff', '-m', `Merge ${featureBranch}`, featureBranch)
        }
      ], { concurrency: false })
    },
    require('./install')(options),
    require('./test')(options),
    {
      title: `Push`,
      task: () => {
        return new Listr([
          {
            title: `Push ${fromLocalBranch}`,
            task: () => push(config.remote, fromLocalBranch)
          },
          {
            title: `Remove ${chalk.green(config.remote + '/' + featureBranch)}`,
            enabled: removeRemoteBranch,
            task: () => push(config.remote, `:${featureBranch}`)
          },
          {
            title: `Remove ${chalk.green(featureBranch)}`,
            enabled: removeBranch,
            task: () => branch('-d', featureBranch)
          }
        ], { concurrency: false });
      }
    }
  ], {});

  return tasks
    .run()
    .then(() => {
      console.log(chalk.green(figures.tick), 'Branch', chalk.green(featureBranch), ' is finished');
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


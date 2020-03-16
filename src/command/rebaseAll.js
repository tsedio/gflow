/* eslint-disable no-shadow */
const { catchError } = require('rxjs/operators');
const Listr = require('listr');
const chalk = require('chalk');
const figures = require('figures');
const config = require('../config');
const git = require('../git/index');
const { getBrancheName } = require('../utils/get-branche-name');
const { getRebaseInfo } = require('../utils/get-rebase-info');
const refreshRepository = require('./refresh-repository');

/**
 *
 * @param options
 * @returns {Listr}
 */
function rebaseBranches(options) {
  const remoteBranches = git.branchesInfos('-r');

  const rules = Object.concat(
    [options.production, options.develop, 'legacy', /\d+\.\d+\.\d+/gi],
    (options.ignores || []).map(o => new RegExp(o))
  );

  const branchesFailed = [];

  const tasks = remoteBranches.filter(branchInfo => !rules.find(rule => getBrancheName(branchInfo.branch).match(rule))).map(branchInfo => {
    const branchName = getBrancheName(branchInfo.branch);

    return {
      title: `${branchInfo.branch}`,
      task: () => new Listr([
        {
          title: 'Checkout',
          task: (ctx) => {
            ctx.branchesFailed = branchesFailed;
            ctx.skipPush = false;
            return git.checkout('-b', `branch-${branchName}`, branchInfo.branch);
          }
        },
        {
          title: 'Rebase',
          task: (ctx, task) => {
            const { fromBranch } = getRebaseInfo();

            return git
              .rebase(fromBranch)
              .pipe(
                catchError(() => {
                  ctx.skipPush = true;
                  branchesFailed.push(branchInfo);
                  task.skip('Rebase failed');

                  return git.rebase('--abort');
                })
              );
          }
        },
        {
          title: 'Push',
          skip: ctx => ctx.skipPush,
          task: () => git.push('-f', config.remote, `HEAD:${branchName}`)
        },
        {
          title: 'Clean',
          task: () => git.checkout(options.production)
        },
        {
          title: 'Remove',
          task: () => git.branch('-D', `branch-${branchName}`)
        }
      ])
    };
  });

  return new Listr(tasks);
}

function runInteractive(options) {
  const tasks = new Listr([
    refreshRepository(options),
    {
      title: 'Rebase branches',
      task: () => rebaseBranches(options)
    }
  ]);

  return tasks
    .run()
    .then(ctx => {
      if (ctx.branchesFailed.length) {
        console.log(chalk.red(` ${chalk.red(figures.cross)} Rebasing on some branches have failed:`));

        ctx.branchesFailed.forEach(info => {
          const line = `${info.date} ${column(info.creation, 15)}  ${column(info.author, 20)} ${info.branch}`;
          console.log(`   ${chalk.red(line)}`);
        });
      }
    })
    .catch(err => {
      console.error(chalk.red(String(err)), err.stack);
    });
}

function line(str = '', length = 100, char = '-') {
  let finalStr = str;
  for (let i = str.length; i < length; i++) {
    finalStr += char;
  }
  return finalStr;
}

function column(str = '', length = 30, char = ' ') {
  return line(str, length, char);
}

module.exports = runInteractive;

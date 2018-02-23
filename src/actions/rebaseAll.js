'use strict';
const Listr = require('listr');
const chalk = require('chalk');
const figures = require('figures');
const { refreshRepository, rebase, branchesInfos, checkout, push, branch } = require('./git/index');

const DEFAULT_OPTIONS = {
  from: 'origin/production'
};

/**
 *
 * @param options
 * @returns {Listr}
 */
function rebaseBranches(options) {
  const remoteBranches = branchesInfos('-r');

  const rules = Object.concat([
      options.production,
      options.master,
      'legacy',
      /\d+\.\d+\.\d+/gi
    ],
    (options.ignores || []).map((o) => new RegExp(o))
  );

  const branchesFailed = [];

  const tasks = remoteBranches
    .filter((branchInfo) =>
      !rules.find(rule => branchInfo.branch.split('/')[ 1 ].match(rule))
    )
    .map((branchInfo) => {
      const branchName = branchInfo.branch.split('/')[ 1 ];

      return {
        title: `${branchInfo.branch}`,
        task: () => new Listr([
          {
            title: `Checkout`,
            task: (ctx, task) => {
              ctx.branchesFailed = branchesFailed;
              ctx.skipPush = false;
              return checkout('-b', `branch-${branchName}`, branchInfo.branch);
            }
          },
          {
            title: `Rebase`,
            task: (ctx, task) => rebase(options.from)
              .catch(() => {
                ctx.skipPush = true;
                branchesFailed.push(branchInfo);
                task.skip('Rebase failed');
                return rebase('--abort');
              })
          },
          {
            title: 'Push',
            skip: (ctx) => ctx.skipPush,
            task: () => push('-f', 'origin', `HEAD:${branchName}`)
          },
          {
            title: `Clean`,
            task: (ctx, task) => checkout(options.production)
          },
          {
            title: `Remove`,
            task: (ctx, task) => branch('-D', `branch-${branchName}`)
          }
        ])
      };
    });

  return new Listr(tasks);
}

function runInteractive(options = DEFAULT_OPTIONS) {
  options = Object.assign({}, DEFAULT_OPTIONS, options);

  const tasks = new Listr([
    {
      title: 'Refresh local repository',
      task: () => refreshRepository(options)
    },
    {
      title: 'Rebase branches',
      task: () => rebaseBranches(options)
    }
  ]);

  return tasks
    .run()
    .then((ctx) => {

      if (ctx.branchesFailed.length) {

        console.log(chalk.red(' ' + chalk.red(figures.cross) + ' Rebasing on some branches have failed:'));

        ctx.branchesFailed.forEach((info) => {
          const line = info.date + ' ' + column(info.creation, 15) + ' ' + ' ' + column(info.author, 20) + ' ' + info.branch;
          console.log('   ' + chalk.red(line));
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


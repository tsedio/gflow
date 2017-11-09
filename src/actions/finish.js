"use strict";
const Listr = require("listr");
const chalk = require("chalk");
const figures = require("figures");

const hasYarn = require("has-yarn");
const {refreshRepository, currentBranchName, branch, checkout, merge, push, rebase} = require("./git/index");

const DEFAULT_OPTIONS = {
  master: "master",
  production: "production",
  test: true,
  yarn: hasYarn()
};

function runInteractive(options = {}) {
  options = Object.assign({}, DEFAULT_OPTIONS, options);
  const currentBranch = currentBranchName();

  const tasks = new Listr([
    {
      title: "Refresh local repository",
      task: () => refreshRepository()
    },
    {
      title: "Rebase and prepare workspace",
      task: () => new Listr([
        {
          title: `Rebase ${currentBranch} from origin/${options.production}`,
          task: () => rebase(`origin/${options.production}`)
        },
        {
          title: `Delete locale branch ${options.production}`,
          task: (ctx, task) => branch("-D", options.production)
            .catch(() => {
              task.skip(`Local branch ${options.production} not found`);
              return Promise.resolve();
            })
        },
        {
          title: `Checkout branch ${options.production}`,
          task: (ctx, task) => checkout("-b", options.production, `origin/${options.production}`)
        },
        {
          title: `Merging branch ${currentBranch}`,
          task: () => merge("--no-ff", "-m", `Merge ${currentBranch}`, currentBranch)
        }
      ], {concurrency: false})
    },
    require("./install")(options),
    require("./test")(options),
    {
      title: `Push`,
      task: () =>
        new Listr([
          {
            title: `${options.master}`,
            enabled: () => currentBranch === options.master,
            task: () => push("origin", options.master)
          },
          {
            title: `${options.production}`,
            task: () => push("origin", options.production)
          },
          {
            title: `Remove branch origin/${currentBranch}`,
            enabled: () => currentBranch !== options.master,
            task: () => push("origin", `:${currentBranch}`)
          },
          {
            title: `Remove branch ${currentBranch}`,
            enabled: () => currentBranch !== options.master,
            task: () => branch("-d", currentBranch)
          }
        ], {concurrency: false})
    }
  ], {});

  return tasks
    .run()
    .then(() => {
      console.log(chalk.green(figures.tick), "Branch", currentBranch, " is finished");
    })
    .catch(err => {
      console.error(String(err));
      return Promise.resolve();
    });
}

module.exports = runInteractive;


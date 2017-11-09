"use strict";
const Listr = require("listr");
const execa = require("execa");
const chalk = require("chalk");
const figures = require("figures");
const {refreshRepository, currentBranchName, branch, checkout, merge, push, rebase} = require("../git/index");

const DEFAULT_OPTIONS = {
  master: "master",
  production: "production",
  test: true
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
            })
        },
        {
          title: `Checkout branch ${options.production}`,
          task: (ctx, task) => checkout("-b", options.production, `origin/${options.production}`)
        },
        {
          title: `Merging branch ${currentBranch}`,
          renderer: "verbose",
          task: () => merge("--no-ff", "-m", `Merge ${currentBranch}`, currentBranch)
        }
      ], {concurrency: false})
    },
    {
      title: "Install",
      task: () => {
        return new Listr([
          {
            title: "Install package dependencies with Yarn",
            skip: ctx => !options.test,
            task: (ctx, task) => execa("yarn")
              .catch(() => {
                ctx.yarn = false;

                task.title = `${task.title} (or not)`;
                task.skip("Yarn not available");
              })
          },
          {
            title: "Install package dependencies with npm",
            skip: ctx => !options.test || ctx.yarn !== false && "Dependencies already installed with Yarn",
            task: (ctx, task) => {
              task.output = "Installing dependencies...";

              return execa("npm", ["install"]);
            }
          }
        ], {concurrency: false});
      }
    },
    {
      title: "Test",
      skip: ctx => !options.test,
      task: (ctx) => execa(ctx.yarn ? "yarn" : "npm", ["test"])
    },
    {
      title: `Push`,
      task: () =>
        new Listr([
          {
            title: `${options.production}`,
            skip: () => currentBranch !== options.master,
            task: () => push("origin", options.master)
          },
          {
            title: `${options.master}`,
            task: () => push("origin", options.production)
          },
          {
            title: `Remove branch origin/${currentBranch}`,
            skip: () => currentBranch === options.master,
            task: () => push("origin", `:${currentBranch}`)
          },
          {
            title: `Remove branch ${currentBranch}`,
            skip: () => currentBranch === options.master,
            task: () => branch("-d", currentBranch)
          }
        ], {concurrency: false})
    }
  ]);

  return tasks
    .run()
    .then(() => {
      console.log(chalk.green(figures.tick), "Branch", currentBranch, " is finished");
    })
    .catch(err => {
      console.error(chalk.red(String(err)));
    });
}

module.exports = runInteractive;


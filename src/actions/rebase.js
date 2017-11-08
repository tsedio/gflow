"use strict";
const Listr = require("listr");
const chalk = require("chalk");
const figures = require("figures");
const {refreshRepository, rebase, currentBranchName} = require("../git/index");

const DEFAULT_OPTIONS = {
  from: "origin/production"
};

function runInteractive(options = DEFAULT_OPTIONS) {
  options = Object.assign({}, DEFAULT_OPTIONS, options);

  const tasks = new Listr([
    {
      title: "Refresh local repository",
      task: () => refreshRepository()
    },
    {
      title: "Rebase current branch",
      task: () => rebase(options.from)
    }
  ]);

  return tasks
    .run()
    .then(() => {
      console.log(chalk.green(figures.tick), "Branch", currentBranchName(), "rebased from " + options.from + " HEAD");
    })
    .catch(err => {
      console.error(chalk.red(String(err)));
    });
}

module.exports = runInteractive;


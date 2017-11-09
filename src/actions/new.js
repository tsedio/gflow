"use strict";
const Listr = require("listr");
const chalk = require("chalk");
const figures = require("figures");
const {refreshRepository, checkout} = require("../git/index");

const DEFAULT_OPTIONS = {
  branchName: "branch_name",
  type: "feat",
  from: "origin/production"
};

function runInteractive(options = DEFAULT_OPTIONS) {
  options = Object.assign({}, DEFAULT_OPTIONS, options);

  options.branch = `${options.type}_${options.branchName}`;

  const tasks = new Listr([
    {
      title: "Refresh local repository",
      task: () => refreshRepository()
    },
    {
      title: "Create branch",
      task: () => checkout("--no-track", "-b", options.branch, options.from)
    }
  ]);

  return tasks
    .run()
    .then(() => {
      console.log(chalk.green(figures.tick), "New branch", options.branch, "created from " + options.from + " HEAD");
    })
    .catch(err => {
      console.error(chalk.red(String(err)));
    });
}

module.exports = runInteractive;
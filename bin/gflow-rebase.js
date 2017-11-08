#!/usr/bin/env node
const commander = require("commander");
const chalk = require("chalk");
const figures = require("figures");
const {rebase, git} = require("../src");

commander
  .usage("gflow-rebase")
  .option("-f, --from <fromBranch>", "Rebase a branch from another branch. By default origin/production.")
  .action(() => {
  })
  .parse(process.argv);

let options = {};

if (commander.from) {
  options.from = commander.from;
}

options = rebase(options);

console.log(chalk.green(figures.tick), "Branch", git.currentBranchName(), "rebased from " + options.from + " HEAD");
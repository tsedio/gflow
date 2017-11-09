#!/usr/bin/env node
"use strict";
const commander = require("commander");
const {rebase, getConfiguration} = require("../src");

commander
  .usage("gflow-rebase")
  .option("-o, --from <fromBranch>", "Rebase a branch from another branch. By default origin/production.")
  .action(() => {
  })
  .parse(process.argv);

let options = {};

if (commander.from) {
  options.from = commander.from;
}

getConfiguration()
  .then((config) =>
    rebase(Object.assign(config, options))
  );
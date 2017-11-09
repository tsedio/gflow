#!/usr/bin/env node
"use strict";
const commander = require("commander");
const {rebase, git} = require("../src");

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

rebase(options);


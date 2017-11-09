#!/usr/bin/env node
"use strict";
const commander = require("commander");
const {push, getConfiguration} = require("../src");

commander
  .usage("gflow-push")
  .option("-o, --from <fromBranch>", "Rebase a branch from another branch. By default origin/production.")
  .option("-f, --force <fromBranch>", "Force pushing branch.", (v, t) => t + 1, 0)
  .option("-s, --skip", "Skip the unit test.", (v, t) => t + 1, 0)
  .action(() => {
  })
  .parse(process.argv);

let options = {
  test: !commander.skip,
  force: !!commander.force
};

getConfiguration()
  .then((config) => {
    options.from = "origin/" + config.production;
    if (commander.from) {
      options.from = commander.from;
    }
    push(Object.assign({}, config, options));
  });
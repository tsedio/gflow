#!/usr/bin/env node
"use strict";
const commander = require("commander");
const {rebase, getConfiguration} = require("../src");

commander
  .alias("gflow rebase")
  .option("-o, --from <fromBranch>", "Rebase a branch from another branch. By default origin/production.")
  .action(() => {
  })
  .parse(process.argv);

let options = {};

getConfiguration()
  .then((config) => {
    options.from = "origin/" + config.production;
    if (commander.from) {
      options.from = commander.from;
    }
    rebase(Object.assign({}, config, options));
  });
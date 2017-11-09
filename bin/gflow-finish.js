#!/usr/bin/env node
"use strict";
const commander = require("commander");
const {finish} = require("../src");

commander
  .usage("gflow-rebase")
  .option("-s, --skip", "Skip the unit test.", (v, t) => t + 1, 0)
  .action(() => {
  })
  .parse(process.argv);

let options = {
  test: !commander.skip
};

finish(options);


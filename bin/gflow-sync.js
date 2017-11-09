#!/usr/bin/env node
"use strict";
const commander = require("commander");
const {sync} = require("../src");

commander
  .usage("gflow-rebase")
  .action(() => {
  })
  .parse(process.argv);

let options = {};

sync(options);


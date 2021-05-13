#!/usr/bin/env node

const commander = require("commander");
const { commands, config } = require("../src");

commander
  .usage("gflow sync")
  .action(() => {})
  .parse(process.argv);

commands.Sync.syncBranches(config.toObject());

#!/usr/bin/env node

const commander = require("commander");
const { rebaseAll, config } = require("../src");

commander
  .alias("gflow rebase-all")
  .option(
    "-o, --from <fromBranch>",
    "Rebase all branch from a branch. By default origin/production."
  )
  .action(() => {})
  .parse(process.argv);

const options = {};

options.from = config.remoteProduction;
if (commander.from) {
  options.from = commander.from;
}
rebaseAll(Object.assign({}, config.toObject(), options));

#!/usr/bin/env node

const commander = require("commander");
const { commands, config } = require("../src");

const options = {};

commander
  .alias("gflow finish <fromBranch>")
  .arguments("<fromBranch>")
  .option("-s, --skip", "Skip the unit test.", (v, t) => t + 1, 0)
  .action(fromBranch => {
    options.fromBranch = fromBranch;
  })
  .parse(process.argv);

commands.Finish.finishBranch({
  ...options,
  test: commander.skip === undefined ? !config.skipTest : !commander.skip
}).catch(er => {
  console.error(er);
});

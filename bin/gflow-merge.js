#!/usr/bin/env node

const commander = require('commander');
const { finish, config } = require('../src');

const options = {};

commander
  .alias('gflow merge <fromBranch>')
  .arguments('<fromBranch>')
  .option('-s, --skip', 'Skip the unit test.', (v, t) => t + 1, 0)
  .action(fromBranch => {
    options.fromBranch = fromBranch;
  })
  .parse(process.argv);

finish({
  ...options,
  test: commander.skip === undefined ? !config.skipTest : !commander.skip
}).catch(er => {
  console.log(er);
});

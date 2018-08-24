#!/usr/bin/env node

const commander = require('commander');
const { rebase, config } = require('../src');

const options = {};

commander
  .alias('gflow rebase <fromBranch>')
  .arguments('<fromBranch>')
  .action(fromBranch => {
    options.fromBranch = fromBranch;
  })
  .on('--help', () => {
    console.log('');
    console.log('  Examples:');
    console.log('');
    console.log('    $ gflow rebase');
    console.log('    Is shortcut to: ');
    console.log(`    $ gflow rebase ${config.remoteProduction}`);
    console.log('');
  })
  .parse(process.argv);

rebase(options);

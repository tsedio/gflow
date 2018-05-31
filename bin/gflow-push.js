#!/usr/bin/env node
'use strict';
const commander = require('commander');
const { config, push } = require('../src');
const options = {};

commander
  .usage('[options]')
  .alias('gflow push <fromBranch>')
  .option('-f, --force', 'Force pushing branch.', (v, t) => t + 1, 0)
  .option('-s, --skip', 'Skip the unit test.', (v, t) => t + 1, 0)
  .action((fromBranch) => {
    options.fromBranch = fromBranch;
  })
  .on('--help', () => {
    console.log('');
    console.log('  Examples:');
    console.log('');
    console.log(`    $ gflow rebase`);
    console.log(`    Is shortcut to: `);
    console.log(`    $ gflow rebase ${config.remoteProduction}`);
    console.log('');
  })
  .parse(process.argv);


push({
  fromBranch: options.fromBranch,
  test: commander.skip === undefined ? !config.skipTest : !commander.skip,
  force: !!commander.force
});

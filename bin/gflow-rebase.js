#!/usr/bin/env node
'use strict';
const commander = require('commander');
const { rebase, config } = require('../src');

let options = {};

commander
  .alias('gflow rebase <fromBranch>')
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

rebase(options);


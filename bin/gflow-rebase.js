#!/usr/bin/env node
'use strict';
const commander = require('commander');
const { rebase, config } = require('../src');

commander
  .alias('gflow rebase')
  .option('-o, --from <fromBranch>', 'Rebase a branch from another branch. By default origin/production.')
  .action(() => {
  })
  .parse(process.argv);

let options = {};

config
  .then((settings) => {
    options.from = config.remoteProduction;
    if (commander.from) {
      options.from = commander.from;
    }
    rebase(options);
  });
#!/usr/bin/env node
'use strict';
const commander = require('commander');
const { rebaseAll, getConfiguration } = require('../src');

commander
  .alias('gflow rebase-all')
  .option('-o, --from <fromBranch>', 'Rebase all branch from a branch. By default origin/production.')
  .action(() => {
  })
  .parse(process.argv);

let options = {};

getConfiguration()
  .then((config) => {
    options.from = 'origin/' + config.production;
    if (commander.from) {
      options.from = commander.from;
    }
    rebaseAll(Object.assign({}, config, options));
  });
#!/usr/bin/env node
'use strict';

const commander = require('commander');
const chalk = require('chalk');
const { newBranch, getConfiguration } = require('../src');

let options = {
  branchName: '',
  type: ''
};

commander
  .usage('[feat|fix|chore|docs] <branchName> [options]')
  .alias('gflow new')
  .arguments('<arg1> [arg2]')
  .option('-t --type <type>', 'Type of the branch (feat, fix, chore, docs)', /^(feat|fix|docs|chore)$/i)
  .option('-o, --from <fromBranch>', 'Create a branch from another branch. By default production.')
  .action((_type_, _branchName_) => {
    if (!_branchName_) {
      _branchName_ = _type_;
      _type_ = '';
    }
    options.branchName = _branchName_;
    options.type = _type_ || '';
  })
  .parse(process.argv);

if (!options.branchName) {
  console.error(chalk.red('The branchName is required'));

  if (!options.branchName) {
    commander.outputHelp((o) => chalk.red(o));
  }
  process.exit(0);
}

getConfiguration()
  .then((config) => {
    options.from = 'origin/' + config.production;
    if (commander.type) {
      options.type = commander.type;
    }

    if (commander.from) {
      options.from = commander.from;
    }

    newBranch(Object.assign({}, config, options));
  });


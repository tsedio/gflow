#!/usr/bin/env node
'use strict';

const commander = require('commander');
const { newBranchInteractive, config } = require('../src');
const { assert } = require('./utils/assert');

let options = {
  interactive: true
};

commander
  .usage('[feat|fix|chore|docs] <branchName> <fromBranch>')
  .alias('gflow new')
  .action((_type_, _branchName_, _fromBranch_) => {
    if (!_branchName_) {
      _branchName_ = _type_;
      _fromBranch_ = _branchName_;
      _type_ = '';
    }

    options.interactive = false;
    options.branchName = _branchName_;
    options.fromBranch = _fromBranch_ || config.remoteProduction;
    options.type = _type_ || '';
  })
  .parse(process.argv);

newBranchInteractive(options).catch((er) => console.error(er));

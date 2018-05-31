#!/usr/bin/env node
'use strict';

const commander = require('commander');
const { newBranchInteractive, config } = require('../src');
const { assert } = require('./utils/assert');

let options = {};

commander
  .usage('[feat|fix|chore|docs] <branchName> <fromBranch>')
  .alias('gflow new')
  .action((...args) => {
    let [_type_, _branchName_, _fromBranch_] = args.slice(0, args.length - 1);

    if (!config.branchTypes[_type_]) {
      options.type = '';
      options.branchName = _type_;
    } else {
      options.type = _type_;
      options.branchName = _branchName_;
    }

    options.fromBranch = _fromBranch_;
  })
  .parse(process.argv);

newBranchInteractive(options).catch((er) => console.error(er));

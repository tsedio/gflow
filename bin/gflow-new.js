#!/usr/bin/env node

const commander = require('commander');
const { newBranchInteractive, config } = require('../src');

const options = {};

const branches = Object.keys(config.branchTypes).join('|');

commander
  .usage(`[${branches}] <branchName> <fromBranch>`)
  .arguments('<branchName> <fromBranch>')
  .alias('gflow new')
  .action((...args) => {
    const [_type_, _branchName_, _fromBranch_] = args.slice(0, args.length - 1);

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

newBranchInteractive(options).catch(er => console.error(er));

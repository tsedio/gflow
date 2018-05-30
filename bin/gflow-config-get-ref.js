#!/usr/bin/env node

const commander = require('commander');
const chalk = require('chalk');
const { config } = require('../src');
const { git } = require('../src');

const options = {
  branchName: git.currentBranchName()
};

commander
  .alias('gflow config get-ref <branchName>')
  .action((branchName) => {
    options.branchName = branchName;
  })
  .parse(process.argv);

const refBranch = config.getBranchRef(options.branchName) || config.develop;
const relatedBranches = config.getRelatedBranches(options.branchName);

console.log(`Branch ${chalk.green(options.branchName)} follow ${chalk.green(config.remote + '/' + refBranch)} branch`);

if (relatedBranches.length) {
  console.log(`Branch ${chalk.green(options.branchName)} has theses related branches:`);

  relatedBranches.forEach((branch) => {
    console.log('- ', branch);
  });
}


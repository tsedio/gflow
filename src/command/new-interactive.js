const inquirer = require('inquirer');
const config = require('../config/index');
const newBranch = require('./new');
const git = require('../git/index');
const { normalizeBranchName } = require('../utils/normalize-branch');
const { toRemote } = require('../utils/to-remote');

function runInteractive(options = {}) {
  git.refreshRepository();

  const currentBranch = git.currentBranchName();
  let startFromBranches = [config.remoteProduction];

  if (startFromBranches.indexOf(toRemote(currentBranch)) === -1 && git.branchExists(currentBranch, config.remote)) {
    startFromBranches = startFromBranches.concat(toRemote(currentBranch));
  }

  const refBranches = config.refs
    .references()
    .filter(name => git.branchExists(name, config.remote))
    .map(name => toRemote(name));

  if (refBranches.length) {
    startFromBranches = startFromBranches.concat(new inquirer.Separator(), refBranches);
  }

  const remoteBranches = git.branchesInfos('-r')
    .map(info => info.branch)
    .filter(name => startFromBranches.indexOf(name) === -1 && !(name === config.remoteDevelop || name === config.remoteProduction));

  if (remoteBranches.length) {
    startFromBranches = startFromBranches.concat(new inquirer.Separator(), remoteBranches);
  }

  return inquirer
    .prompt([
      {
        type: 'list',
        name: 'type',
        message: 'Choose the type of your branch:',
        choices: config.getBranchTypes(),
        default: options.type,
        when: !options.type
      },
      {
        type: 'input',
        name: 'branchName',
        message: 'What is the branch name ?',
        validate(branch) {
          if (!branch.length) {
            return 'Branch name is required';
          }

          if (git.branchExists(branch, config.remote)) {
            return `${branch} already exists`;
          }

          return true;
        },

        transformer(value) {
          return normalizeBranchName(value);
        },

        when: !options.branchName
      },
      {
        type: 'list',
        name: 'fromBranch',
        message: 'Start your branch from:',
        default: startFromBranches.indexOf(options.fromBranch || config.remoteProduction),
        choices: startFromBranches,
        when: !options.fromBranch || currentBranch !== config.develop
      }
    ])
    .then(answers => newBranch(Object.assign(options, answers)));
}

module.exports = runInteractive;

const inquirer = require('inquirer');
const config = require('../../config/index');
const git = require('../../git/index');
const { toRemote } = require('../../utils/to-remote');

module.exports = ({ fromBranch, message = 'Start your branch from:' }) => {
  const currentBranch = git.currentBranchName();
  let startFromBranches = [config.remoteProduction];

  if (startFromBranches.indexOf(toRemote(currentBranch)) === -1 && git.branchExists(currentBranch, config.remote)) {
    startFromBranches = startFromBranches.concat(toRemote(currentBranch));
  }

  const remoteBranches = git.branchesInfos('-r')
    .map(info => info.branch)
    .filter(name => startFromBranches.indexOf(name) === -1 && !(name === config.remoteDevelop || name === config.remoteProduction));

  if (remoteBranches.length) {
    startFromBranches = startFromBranches.concat(new inquirer.Separator(), remoteBranches);
  }

  return {
    type: 'list',
    name: 'fromBranch',
    message,
    default: startFromBranches.indexOf(fromBranch || config.remoteProduction),
    choices: startFromBranches,
    when: !fromBranch || currentBranch !== config.develop
  };
};

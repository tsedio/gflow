const git = require('../git');
const { getAncestorBranch } = require('./get-ancestor-branch');

module.exports = {
  getRebaseInfo(fromBranch) {
    const branch = git.currentBranchName();

    return {
      branch,
      fromBranch: fromBranch || getAncestorBranch(branch)
    };
  }
};

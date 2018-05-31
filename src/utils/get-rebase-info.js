const git = require('../git');
const config = require('../config');

module.exports = {
  getRebaseInfo(fromBranch) {
    const branch = git.currentBranchName();
    fromBranch = fromBranch || config.getRemoteBranchRef(branch) || config.remoteProduction;

    return {
      branch,
      fromBranch
    };
  }
};
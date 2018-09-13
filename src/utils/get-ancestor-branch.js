const git = require('../git');
const config = require('../config');

const getBranches = () =>
  git
    .branchesInfos('-r')
    .concat(git.branchesInfos())
    .map((info) => info.branch);

module.exports = {
  getAncestorBranch(currentBranch = git.currentBranchName()) {
    const paths = currentBranch.split('/');

    paths.splice(-2);

    const fromBranch = paths.join('/');
    if (fromBranch && fromBranch !== currentBranch) {
      const branch = getBranches().find((brch) => brch.replace(`${config.remote}/`, '') === fromBranch);
      if (branch) {
        return branch;
      }
    }

    return config.remoteDevelop;
  }
};

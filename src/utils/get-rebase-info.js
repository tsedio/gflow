const { getBranchName } = require("./get-branche-name");

const git = require("../git");
const config = require("../config");

module.exports = {
  getRebaseInfo(fromBranch) {
    fromBranch = fromBranch || config.remoteProduction;
    const featureBranch = git.currentBranchName();
    return {
      featureBranch,
      featureLocaleBranch: getBranchName(featureBranch),
      fromBranch,
      fromLocalBranch: getBranchName(fromBranch)
    };
  }
};

const config = require('../config');

module.exports = {
  normalizeBranchName({ fromBranch, branchName, type }) {
    const paths = [type || config.branchTypes.default, branchName.replace(/[- /]/gi, '_')];

    fromBranch = fromBranch.replace(`${config.remote}/`, '');

    if (fromBranch && [config.develop, config.production].indexOf(fromBranch) === -1) {
      paths.unshift(fromBranch);
    }

    return paths.join('/').replace('\\/');
  }
};

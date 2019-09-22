const config = require('../config');

module.exports = {
  normalizeBranchName({ branchName, type }) {
    const branchType = config.branchTypes[type] || config.branchTypes.default;
    const branchPath = branchName.replace(/[- _/]/gi, config.charReplacement);

    return [branchType, branchPath].join(config.charReplacement).replace('\\/');
  }
};

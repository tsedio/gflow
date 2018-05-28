const config = require('../config');

module.exports = {
  /**
   *
   * @returns {string}
   */
  normalizeBranchName(branchName, type) {

    type = config.branchTypes[type] || type;

    return `${type ? type + config.charBranchNameSeparator : ''}${branchName.replace(/[- ]/gi, '_')}`;
  }
};
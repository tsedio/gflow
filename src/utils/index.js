const config = require('../config');

module.exports = {
  /**
   *
   * @returns {string}
   */
  normalizeBranchName(branchName, type) {
    return `${type ? type + config.charBranchNameSeparator : ''}${branchName.replace(/[- ]/gi, '_')}`;
  }
};
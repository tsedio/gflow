const config = require("../config");

module.exports = {
  /**
   *
   * @param branch
   * @returns {string}
   */
  toRemote(branch) {
    branch = branch.replace(`${config.remote}/`);
    return `${config.remote}/${branch}`;
  }
};

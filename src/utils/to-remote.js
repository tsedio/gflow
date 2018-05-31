const config = require('../config');

module.exports = {
  /**
   *
   * @param branch
   * @returns {string}
   */
  toRemote(branch) {
    const info = branch.split('/');
    return `${config.remote}/${info[1] || info[0]}`;
  }
};
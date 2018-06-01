const config = require('../config');

module.exports = {
  getBranchName(branch) {
    return branch.replace(`${config.remote}/`, '');
  }
};

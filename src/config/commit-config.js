const config = require('./index');
const git = require('../git/index');

module.exports = {
  /**
   *
   */
  commitConfig() {
    config.writeConfiguration();

    if (git.hasStagedChanges((item) => item === '.gflowrc')) {
      git.addSync('.gflowrc');

      const indexOf = git.sync('log', '-1').join('|').indexOf('chore: gflow update configuration [ci skip]');

      if (indexOf === -1) {
        return git.commit('-m', 'chore: gflow update configuration [ci skip]', '--no-verify');
      }

      return git.commit('--amend', '--no-edit');
    }

    return undefined;
  }
};

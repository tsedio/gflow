const readPkgUp = require('read-pkg-up');
const md5 = require('md5');
const git = require('../git');

module.exports = {

  getHash() {
    const { pkg = {} } = readPkgUp.sync();
    let hash = '';

    if (pkg.dependencies) {
      hash += JSON.stringify(pkg.dependencies);
    }

    if (pkg.devDependencies) {
      hash += JSON.stringify(pkg.devDependencies);
    }

    return md5(hash);
  },

  getDate() {
    const date = git.config('--local', 'npm.date');
    return date ? new Date(date) : undefined;
  },

  requiredInstall() {
    const hashFromConfig = git.config('--local', 'npm.hash');
    const currentHash = module.exports.getHash();
    const latestUpdate = module.exports.getDate();
    const diff = Math.abs(new Date() - latestUpdate) / (24 * 3600 * 1000);

    return diff >= 7 || currentHash !== hashFromConfig;
  },

  refresh() {
    git.config('--local', 'npm.hash', `${module.exports.getHash()}`);
    git.config('--local', 'npm.date', `${new Date().toISOString()}`);
  }
};

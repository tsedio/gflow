const hasYarn = require('has-yarn');
const Listr = require('listr');
const exec = require('../exec');

module.exports = () => ({
  title: 'Install',
  task: () => {
    return new Listr([
      {
        title: 'Installing dependencies using Yarn',
        enabled: () => hasYarn() === true,
        task: () => exec('yarn', [ 'install', '--frozen-lockfile' ])
          .catch(err => {
            if (err.stderr.startsWith('error Your lockfile needs to be updated')) {
              throw new Error('yarn.lock file is outdated. Run yarn, commit the updated lockfile and try again.');
            }
            throw err;
          })
      },
      {
        title: 'Installing dependencies using npm',
        enabled: () => hasYarn() === false,
        task: () => exec('npm', [ 'install', '--no-package-lock' ])
      }
    ], { concurrency: false });
  }
});
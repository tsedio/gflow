const hasYarn = require('has-yarn');
const Listr = require('listr');
const exec = require('../../exec');
const checkInstall = require('./check-install');

module.exports = () => ({
  title: 'Install',
  enabled: () => checkInstall.requiredInstall(),
  task: () => new Listr(
    [
      {
        title: 'Installing dependencies using Yarn',
        enabled: () => hasYarn() === true,
        task: () => exec('yarn', ['install', '--frozen-lockfile'])
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
        task: () => exec('npm', ['install', '--no-package-lock'])
      },
      {
        title: 'Refresh metadata',
        task: () => checkInstall.refresh()
      }
    ],
    { concurrency: false }
  )
});

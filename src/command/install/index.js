const hasYarn = require('has-yarn');
const Listr = require('listr');
const { catchError, throwError } = require('rxjs/operators');
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
        task: () => exec('yarn', ['install', '--frozen-lockfile', '--production=false'])
          .pipe(catchError(error => {
            if (error.stderr.startsWith('error Your lockfile needs to be updated')) {
              throwError(new Error('yarn.lock file is outdated. Run yarn, commit the updated lockfile and try again.'));
            }

            throwError(error);
          }))
      },
      {
        title: 'Installing dependencies using npm',
        enabled: () => hasYarn() === false,
        task: () => {
          const args = ['install', '--no-package-lock', '--no-production'];
          return exec('npm', args);
        }
      },
      {
        title: 'Refresh metadata',
        task: () => checkInstall.refresh()
      }
    ],
    { concurrency: false }
  )
});

const hasYarn = require('has-yarn');
const Listr = require('listr');
const { catchError, throwError } = require('rxjs/operators');
const exec = require('../../exec');

module.exports = () => ({
  title: 'Install',
  task: () => new Listr(
    [
      {
        title: 'Installing dependencies using Yarn',
        enabled: () => hasYarn() === true,
        task: () => exec('yarn', ['install'])
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
          const args = ['install'];
          return exec('npm', args);
        }
      }
    ],
    { concurrency: false }
  )
});

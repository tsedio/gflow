const Listr = require('listr');
const chalk = require('chalk');
const { catchError } = require('rxjs/operators');
const { of } = require('rxjs');
const git = require('../../git');


module.exports = ({ featureBranch, fromBranch, fromLocalBranch, rebase = true }) => ({
  title: 'Rebase and prepare workspace',
  task: () => new Listr(
    [
      {
        title: `Rebase ${chalk.green(featureBranch)} from ${chalk.green(fromBranch)}`,
        enabled: () => rebase,
        task: () => git.rebase(fromBranch)
      },
      {
        title: `Delete locale branch ${chalk.green(fromLocalBranch)}`,
        task: (ctx, task) => git.branch('-D', fromLocalBranch)
          .pipe(catchError(() => {
            task.skip(`Local branch ${chalk.green(fromLocalBranch)} not found`);
            return of(undefined);
          }))
      },
      {
        title: `Checkout branch ${chalk.green(fromLocalBranch)}`,
        task: () => git.checkout('-b', fromLocalBranch, fromBranch)
      },
      {
        title: `Merging branch ${chalk.green(featureBranch)}`,
        task: () => git.merge('--no-ff', '-m', `Merge ${featureBranch}`, featureBranch)
      }
    ],
    { concurrency: false }
  )
});

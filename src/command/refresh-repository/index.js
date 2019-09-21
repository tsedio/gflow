const { of } = require('rxjs');
const { catchError } = require('rxjs/operators');

const git = require('../../git/index');

module.exports = ({ output = [] } = {}) => ({
  title: 'Refresh local repository',
  task: () => {
    const observable = git.refreshRepository();

    observable.pipe(catchError((err) => of(err)));

    observable.subscribe(result => {
      output.push(result);
    });

    return observable;
  }
});

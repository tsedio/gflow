const { EMPTY } = require("rxjs");
const { catchError } = require("rxjs/operators");
const Listr = require("listr");

const git = require("../../git/index");

function pipe(observable, output) {
  observable.pipe(
    catchError(err => {
      output.push(err);
      return EMPTY;
    })
  );

  observable.subscribe(result => {
    output.push(result);
  });

  return observable;
}

module.exports = ({ output = [] } = {}) => ({
  title: "Refresh local repository",
  task: () =>
    new Listr([
      {
        title: "Git fetch",
        task: () =>
          pipe(
            git.fetch(),
            output
          )
      },
      {
        title: "Git prune",
        task: () =>
          pipe(
            git.prune(),
            output
          )
      }
    ])
});

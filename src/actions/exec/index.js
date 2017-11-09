require("any-observable/register/rxjs-all"); // eslint-disable-line import/no-unassigned-import
const Observable = require("any-observable");
const streamToObservable = require("stream-to-observable");
const execa = require("execa");

module.exports = (cmd, args) => {
  // Use `Observable` support if merged https://github.com/sindresorhus/execa/pull/26
  const cp = execa(cmd, args);

  return Observable.merge(
    streamToObservable(cp.stdout.pipe(split()), {await: cp}),
    streamToObservable(cp.stderr.pipe(split()), {await: cp})
  ).filter(Boolean);
};

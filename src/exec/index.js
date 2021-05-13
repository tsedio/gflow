require("any-observable/register/rxjs-all"); // eslint-disable-line import/no-unassigned-import
const streamToObservable = require("@samverschueren/stream-to-observable");
const { merge } = require("rxjs");
const { filter } = require("rxjs/operators");
const execa = require("execa");
const split = require("split");

module.exports = (cmd, args, opts) => {
  // Use `Observable` support if merged https://github.com/sindresorhus/execa/pull/26
  const cp = execa(cmd, args, opts);

  return merge(
    streamToObservable(cp.stdout.pipe(split()), { await: cp }),
    streamToObservable(cp.stderr.pipe(split()), { await: cp })
  ).pipe(filter(Boolean));
};

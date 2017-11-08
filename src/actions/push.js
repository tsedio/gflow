"use strict";

const {refreshRepository, push, remote, rebase, currentBranchName, branchExists, checkBranchRemoteStatus} = require("../git");

const DEFAULT_OPTIONS = {
  test: false,
  force: false,
  from: "origin/production"
};

/**
 *
 */
function doFetch(options) {
  remote("-v");
  refreshRepository();

  console.log("Fetch done");

  push("-f", "origin", "refs/remotes/" + options.from + ":refs/heads/master");

  console.log("Pushed production on master");
}

/**
 *
 * @param options
 * @returns {Promise.<TResult>}
 */
function doTest(options) {
  return Promise.resolve()
    .then(() => yarn("install"))
    .then(() => {
      if (options.test) {
        return yarn("test");
      }
    })
    .then(() => {

    })
    .catch(() => {

    });
}

module.exports = (options = DEFAULT_OPTIONS) => {
  let featureBranch, isBranchExists;

  options = Object.assign({}, DEFAULT_OPTIONS, options);

  return Promise.resolve()
    .then(() => {
      doFetch(options);

      featureBranch = currentBranchName();
      isBranchExists = branchExists(featureBranch);

      if (isBranchExists && options.force && checkBranchRemoteStatus(featureBranch)) {
        console.warn("Remote branch did not changed");
        return;
      }

      console.log("Remote branch did not changed");

      rebase(options.from);

      console.log("Branch rebased");

      return doTest(options);
    })
    .then(() => {
      git("push", "-u", "-f", "origin", featureBranch);
      console.log(`${featureBranch} PUBLISH DONE`);
      console.log("End publishfeat");
    });
};
"use strict";
const _ = require("lodash");
const readPkgUp = require("read-pkg-up");
const git = require("./actions/git");
const branches = require("./actions/branches");
const newBranch = require("./actions/new");
const rebase = require("./actions/rebase");
const push = require("./actions/push");
const finish = require("./actions/finish");
const sync = require("./actions/sync");
const init = require("./actions/init");

let gflowConfiguration;

module.exports = {
  git,
  branches,
  newBranch,
  rebase,
  push,
  finish,
  sync,
  init,
  getConfiguration() {

    if (gflowConfiguration) {
      return Promise.resolve(gflowConfiguration);
    }

    return readPkgUp().then(({pkg}) => {
      gflowConfiguration = _.cloneDeep(pkg.gflow || {});
      return pkg.gflow || {};
    })
      .catch((er) => {
        return {};
      });
  }
};
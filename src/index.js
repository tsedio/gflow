"use strict";
const git = require("./actions/git");
const branches = require("./actions/branches");
const newBranch = require("./actions/new");
const rebase = require("./actions/rebase");
const push = require("./actions/push");
const finish = require("./actions/finish");
const sync = require("./actions/sync");

module.exports = {
  git,
  branches,
  newBranch,
  rebase,
  push,
  finish,
  sync
};
"use strict";
const git = require("./git");
const branches = require("./actions/branches");
const newBranch = require("./actions/new");
const rebase = require("./actions/rebase");
const push = require("./actions/push");
const finish = require("./actions/finish");

module.exports = {
  git,
  branches,
  newBranch,
  rebase,
  push,
  finish
};
"use strict";
const {branchesInfos} = require("../git");
const DEFAULT_OPTIONS = {};

module.exports = (options = DEFAULT_OPTIONS) => {
  branchesInfos().forEach((info) => {
    console.log(info);
  });
};
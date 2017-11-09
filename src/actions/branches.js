"use strict";
const chalk = require("chalk");
const figures = require("figures");
const {branchesInfos, currentBranchName} = require("./git");
const DEFAULT_OPTIONS = {
  master: "master",
  production: "production"
};

module.exports = (options = DEFAULT_OPTIONS) => {

  options = Object.assign({}, DEFAULT_OPTIONS, options);

  let isUnderProduction = false;
  const currentBranch = currentBranchName();
  return branchesInfos().forEach((info) => {
    const branch = info.branch.split("/")[1];
    const line = info.date + " " + column(info.creation, 15) + " " + " " + column(info.author, 25) + " " + info.branch;
    let current = " ";
    if (currentBranch === branch) {
      current = chalk.yellow(figures.star);
    }

    if (branch === options.production) {
      console.log(current + " " + chalk.yellow(figures.warning) + " ", chalk.yellow(line));
      isUnderProduction = true;
      return;
    }
    if (branch === "origin/" + options.master) {
      console.log(current + " " + chalk.gray(figures.bullet) + " ", chalk.gray(line));
      return;
    }

    if (!isUnderProduction) {
      console.log(current + " " + chalk.green(figures.tick) + " ", line);
    } else {
      console.log(current + " " + chalk.red(figures.cross) + " ", chalk.red(line));
    }

  });
};

function line(str = "", length = 100, char = "-") {
  let finalStr = str;
  for (let i = str.length; i < length; i++) {
    finalStr += char;
  }
  return finalStr;
}

function column(str = "", length = 30, char = " ") {
  return line(str, length, char);
}
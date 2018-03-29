'use strict';
const chalk = require('chalk');
const figures = require('figures');
const inquirer = require('inquirer');
const config = require('./config');
const { branchesInfos, currentBranchName, checkout } = require('./git');

const BRANCHES = new Map();

function runInteractive() {
  const choices = buildBranchesList()
    .map((info) => {
      return { value: info.branch, name: info.message, short: info.branch };
    });

  inquirer.prompt([
    {
      'type': 'list',
      'name': 'branchChoice',
      'message': 'Select branch to switch on',
      'choices': choices.concat([new inquirer.Separator(), 'exit'])
    }
  ])
    .then((answers) => {
      if (answers.branchChoice !== 'exit') {
        switchBranch(answers.branchChoice);
      }
    }).catch(er => console.error(er));
}

/**
 *
 * @param branch
 */
function switchBranch(branch) {
  let branchInfo = BRANCHES.get(branch);
  let observable;

  if (branchInfo) {
    observable = checkout(branchInfo.local ? branchInfo.local.branch : branchInfo.branch);
  } else {
    const branchName = branch.split('/')[1];
    branchInfo = BRANCHES.get(branchName);
    if (branchInfo.local) {
      observable = checkout(branchInfo.local.branch);
    } else {
      observable = checkout('-b', branchName, branchInfo.branch);
    }
  }

  observable.subscribe((o) => {
    console.log(o);
  });

  return observable;
}

/**
 *
 * @returns {Array.<*>}
 */
function branches() {

  const remoteBranches = branchesInfos('-r');
  const localBranches = branchesInfos();

  remoteBranches.forEach((branchInfo) => {
    const branch = branchInfo.branch.split('/')[1];

    if (branch === config.production) {
      branchInfo.$order = -1;
    } else {
      branchInfo.$order = 0;
    }
    BRANCHES.set(branch, branchInfo);
  });

  localBranches.forEach((branchInfo) => {
    const branch = branchInfo.branch;
    if (!BRANCHES.has(branch)) {
      branchInfo.$order = 0;
      BRANCHES.set(branch, branchInfo);
    } else {
      BRANCHES.get(branch).local = branchInfo;
    }
  });

  const list = [];
  BRANCHES.forEach(branch => {
    if (branch.local) {
      if (branch.date !== branch.local.date) {
        list.push(branch.local);
      }
    }
    list.push(branch);
  });
  return list.sort()
    .sort((info1, info2) => {
      if (info1.date === info2.date) {
        if (info1.$order < info2.$order) {
          return 1;
        }
        return 0;
      }
      return info1.date < info2.date ? 1 : -1;
    });
}

/**
 *
 * @returns {*}
 */
function buildBranchesList() {
  let isUnderProduction = false;
  const currentBranch = currentBranchName();

  return branches()
    .map((info) => {
      const branch = info.branch.split('/')[1] || info.branch;
      const line = info.date + ' ' + column(info.creation, 15) + ' ' + ' ' + column(info.author, 20) + ' ' + info.branch;
      let current = ' ';
      if (currentBranch === branch) {
        current = chalk.yellow(figures.star);
      }

      if (branch === config.production) {
        isUnderProduction = true;
        info.message = current + ' ' + chalk.yellow(figures.warning) + ' ' + chalk.yellow(line);
        return info;
      }

      if (branch === config.remoteDevelop) {
        info.message = current + ' ' + chalk.gray(figures.bullet) + ' ' + chalk.gray(line);
        return info;
      }

      if (!isUnderProduction) {
        info.message = current + ' ' + chalk.green(figures.tick) + ' ' + line;
        return info;
      }

      info.message = current + ' ' + chalk.red(figures.cross) + ' ' + chalk.red(line);
      return info;
    });
}

function line(str = '', length = 100, char = '-') {
  let finalStr = str;
  for (let i = str.length; i < length; i++) {
    finalStr += char;
  }
  return finalStr;
}

function column(str = '', length = 30, char = ' ') {
  return line(str, length, char);
}

module.exports = runInteractive;
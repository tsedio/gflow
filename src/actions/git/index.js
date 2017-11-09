"use strict";

const exec = require("../exec");
const {spawnSync, execSync} = require("child_process");

function git(cmd, ...args) {
  // console.log("git", cmd, args.join(" "));
  const response = spawnSync("git", [cmd].concat(args));
  if (response.error) {
    throw response.error;
  }
  const output = response.output.filter(o => !!o).map((o) => o.toString());
  return output;
}

function egit(cmd, ...args) {
  return exec("git", [cmd].concat(args));
}

module.exports = {
  git,
  egit,
  /**
   *
   * @param args
   */
  checkout(...args) {
    return egit("checkout", ...args);
  },
  /**
   *
   * @param args
   */
  branch(...args) {
    return egit("branch", ...args);
  },
  /**
   *
   * @param args
   */
  merge(...args) {
    return egit("merge", ...args);
  },
  /**
   *
   * @param args
   */
  remote(...args) {
    return egit("remote", ...args);
  },
  /**
   *
   * @param args
   */
  fetch(...args) {
    return egit("fetch", ...args);
  },
  /**
   *
   * @returns {*}
   */
  refreshRepository() {
    return egit("fetch", "--all", "--prune", "--tags");
  },
  /**
   *
   * @param args
   */
  push(...args) {
    return egit("push", ...args);
  },
  /**
   *
   * @returns {string}
   */
  currentBranchName() {
    return git("rev-parse", "--abbrev-ref", "HEAD")[0].trim();
  },
  /**
   *
   * @param branch
   * @returns {boolean}
   */
  branchExists(branch) {
    return git("branch", "-a")[0].split("\n").indexOf(`remotes/origin/${branch}`) > -1;
  },
  /**
   *
   * @param branch
   */
  checkBranchRemoteStatus(branch) {
    return egit("cherry", branch, `origin/${branch}`);
  },
  /**
   *
   * @param args
   */
  rebase(...args) {
    return egit("rebase", ...args);
  },
  /**
   *
   * @returns {Array}
   */
  branches(...args) {
    const branches = git("branch", ["-r"].concat(args))[0].split("\n");
    return branches
      .filter((branch) => String(branch).indexOf("HEAD") === -1)
      .filter((branch) => !!branch)
      .map((o) => o.trim());
  },
  /**
   *
   * @param args
   */
  show(branch) {
    const response = execSync(`git show --format="%ci|%cr|%an" ${branch}`);
    return response.toString().split("\n")[0].trim();
  },
  /**
   *
   * @returns {Array}
   */
  branchesInfos() {
    return module.exports.branches()
      .map((branch) => {
        const [date, creation, author] = module.exports.show(branch).split("|");
        return {branch, date, creation, author};
      })
      .sort((info1, info2) => info1.date < info2.date);
  }
};
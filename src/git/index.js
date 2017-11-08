"use strict";
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

module.exports = {
  git,
  /**
   *
   * @param args
   */
  checkout(...args) {
    return git("checkout", ...args);
  },
  /**
   *
   * @param args
   */
  branch(...args) {
    return git("branch", ...args);
  },
  /**
   *
   * @param args
   */
  merge(...args) {
    return git("merge", ...args);
  },
  /**
   *
   * @param args
   */
  remote(...args) {
    return git("remote", ...args);
  },
  /**
   *
   * @param args
   */
  fetch(...args) {
    return git("fetch", ...args);
  },
  /**
   *
   * @returns {*}
   */
  refreshRepository() {
    return module.exports.fetch("-all", "--prune", "--tags");
  },
  /**
   *
   * @param args
   */
  push(...args) {
    return git("push", ...args);
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
    return !!git("branch", "-a")[0].split("\n").indexOf(`remotes/origin/${branch}`);
  },
  /**
   *
   * @param branch
   */
  checkBranchRemoteStatus(branch) {
    return git("cherry", branch, `origin/${branch}`);
  },
  /**
   *
   * @param args
   */
  rebase(...args) {
    return git("rebase", ...args);
  },
  /**
   *
   * @returns {Array}
   */
  branches(...args) {
    const branches = module.exports.branch("-r", ...args)[0].split("\n");
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
    const response = execSync(`git show --format="%ci|%cr|%an" ${branch} | head -n 1`);
    return response.toString().trim();
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
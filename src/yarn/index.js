"use strict";
const YARN = /^win/.test(process.platform) ? "yarn.cmd" : "yarn";

/**
 *
 * @param args
 */

function yarn(...args) {
  console.log("yarn", args.join(" "));
  return new Promise((resolve, reject) => {
    const childProcess = spawn(YARN, args, {stdio: "inherit"});
    childProcess.on("error", reject);
    childProcess.on("close", (code) => {
      if (code !== 0) {
        reject();
      } else {
        resolve();
      }
    });
  });
}

module.exports = {
  /**
   *
   * @param args
   */
  install(...args) {
    return yarn("install", ...args);
  },
  /**
   *
   * @param args
   */
  test(...args) {
    return yarn("test", ...args);
  }
};
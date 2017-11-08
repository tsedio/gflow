"use strict";
const Listr = require("listr");
const execa = require("execa");
const chalk = require("chalk");
const {refreshRepository, push, remote, rebase, currentBranchName, branchExists, checkBranchRemoteStatus} = require("../git");

const DEFAULT_OPTIONS = {
  test: false,
  force: false,
  from: "origin/production"
};


/**
 *
 * @param options
 * @returns {*}
 */
function doFetch(options) {
  remote("-v");
  return refreshRepository().then(() => options);
}

/**
 *
 * @param options
 * @returns {*}
 */
function doSync(options) {
  return push("-f", "origin", "refs/remotes/" + options.from + ":refs/heads/master")
    .then(() => {
      options.featureBranch = currentBranchName();
      return options;
    });
}

/**
 *
 * @param options
 * @returns {*}
 */
function doCheck(options) {

  const isBranchExists = branchExists(options.featureBranch);

  if (isBranchExists && !options.force) {
    return checkBranchRemoteStatus(options.featureBranch)
      .then((result) => options)
      .catch((er) => {
        throw new Error("Remote branch did not changed");
      });

  }
  return Promise.resolve(options);
}

/**
 *
 * @param options
 */
function doRebase(options) {
  return rebase(options.from).then(() => options);
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
    .then(() => options);
}

function doPush(options) {
  return push("-u", "-f", "origin", options.featureBranch)
    .then(() => options);
}

/**
 *
 * @param options
 */
function runInteractive(options = DEFAULT_OPTIONS) {
  options = Object.assign({}, DEFAULT_OPTIONS, options);

  const tasks = new Listr([
    {
      title: "Refresh local repository",
      task: () => {
        return new Listr([
          {
            title: "Fetch",
            task: () => Promise.resolve(doFetch(options))
          },
          {
            title: "Synchronise",
            task: () => Promise.resolve(doSync(options))
          },
          {
            title: "Check status",
            task: () => Promise.resolve(doCheck(options))
          },
          {
            title: "Rebase",
            task: () => Promise.resolve(doRebase(options))
          }
        ], {concurrent: false});
      }
    },
    {
      title: "Install",
      task: () => {
        return new Listr([
          {
            title: "Install package dependencies with Yarn",
            task: (ctx, task) => execa("yarn")
              .catch(() => {
                ctx.yarn = false;

                task.title = `${task.title} (or not)`;
                task.skip("Yarn not available");
              })
          },
          {
            title: "Install package dependencies with npm",
            skip: ctx => ctx.yarn !== false && "Dependencies already installed with Yarn",
            task: (ctx, task) => {
              task.output = "Installing dependencies...";

              return execa("npm", ["install"]);
            }
          }
        ]);
      }
    },
    {
      title: "Test",
      task: (ctx) => execa(ctx.yarn ? "yarn" : "npm", ["test"])
    },
    {
      title: "Push",
      task: () => doPush(options)
    }
  ]);

  return tasks.run()
    .catch(err => {
      console.error(chalk.red(String(err)));
    });
}

module.exports = runInteractive;
const Listr = require("listr");
const chalk = require("chalk");
const figures = require("figures");
const inquirer = require("inquirer");
const branches = require("./branches/index");
const config = require("../config/index");
const git = require("../git/index");
const { normalizeBranchName } = require("../utils/normalize-branch");
const runInstall = require("./install/index");
const runRefreshRepository = require("./refresh-repository");
const runCreateBranch = require("./create-branch");

const DEFAULT_OPTIONS = {
  branchName: "branch_name",
  type: "feat"
};

module.exports = {
  DEFAULT_OPTIONS,
  /**
   *
   * @param options
   * @returns {{branchName: *}}
   */
  getOptions(options = {}) {
    options = { ...DEFAULT_OPTIONS, ...options };

    return {
      ...options,
      featureBranch: normalizeBranchName(options)
    };
  },
  /**
   * Run interactive command
   * @param options
   * @returns {Promise<*>}
   */
  async askQuestions(options = {}) {
    const questions = [
      {
        type: "list",
        name: "type",
        message: "Choose the type of your branch:",
        choices: config.getBranchTypes(),
        default: options.type,
        when: !options.type
      },
      {
        type: "input",
        name: "branchName",
        message: "What is the branch name ?",
        validate(branch) {
          if (!branch.length) {
            return "Branch name is required";
          }

          if (git.branchExists(branch, config.remote)) {
            return `${branch} already exists`;
          }

          return true;
        },

        when: !options.branchName
      },

      branches({ ...options })
    ];

    const answers = await inquirer.prompt(questions);

    return module.exports.newBranch({ ...options, ...answers });
  },
  /**
   *
   * @param options
   * @returns {Listr}
   */
  getTasks(options) {
    return new Listr([
      runRefreshRepository(options),
      runCreateBranch(options),
      runInstall(options)
    ]);
  },
  /**
   * Create a new branch from the given options
   * @param options
   * @returns {Promise<void>}
   */
  async newBranch(options) {
    try {
      options = module.exports.getOptions(options);

      await module.exports.getTasks(options).run();
      console.log(
        chalk.green(figures.tick),
        `New branch ${chalk.green(
          options.featureBranch
        )} created from ${chalk.green(options.fromBranch)} HEAD`
      );
    } catch (err) {
      console.error(chalk.red(String(err.all || err)));
    }
  }
};

const chalk = require("chalk");
const git = require("../../git/index");

module.exports = ({ fromBranch, featureBranch }) => ({
  title: `Create branch from ${chalk.green(fromBranch)}`,
  task: () => git.checkout("--no-track", "-b", featureBranch, fromBranch)
});

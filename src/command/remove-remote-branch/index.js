const chalk = require("chalk");
const config = require("../../config");
const git = require("../../git");

/**
 *
 * @param featureBranch
 * @returns {*|boolean}
 */
function removeRemoteBranch(featureBranch) {
  return (
    git.branchExists(featureBranch, config.remote) &&
    featureBranch !== config.develop
  );
}

module.exports = ({ featureBranch }) => ({
  title: `Remove ${chalk.green(`${config.remote}/${featureBranch}`)}`,
  enabled: () => removeRemoteBranch(featureBranch),
  task: () => git.push(config.remote, `:${featureBranch}`, "--no-verify")
});

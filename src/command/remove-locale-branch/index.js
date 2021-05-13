const chalk = require("chalk");
const config = require("../../config");
const git = require("../../git");

/**
 *
 * @param featureBranch
 * @returns {boolean}
 */
function removeBranch(featureBranch) {
  return (
    featureBranch !== config.develop && featureBranch !== config.production
  );
}

module.exports = ({ featureBranch }) => ({
  title: `Remove ${chalk.green(featureBranch)}`,
  enabled: () => removeBranch(featureBranch),
  task: () => git.branch("-d", featureBranch)
});

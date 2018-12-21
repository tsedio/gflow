const Listr = require('listr');
const chalk = require('chalk');
const git = require('../../git/index');
const config = require('../../config/index');

/**
 *
 * @param options
 * @returns {*}
 */
async function checkBranchRemoteStatus({ featureBranch, force }) {
  const isBranchExists = git.branchExists(featureBranch, config.remote);

  if (isBranchExists && !force) {
    const result = git.checkBranchRemoteStatusSync(featureBranch);
    if (!result) {
      throw new Error('Remote branch changed, check diff before continue');
    }
  }
}


module.exports = ({ featureBranch, fromBranch, force, checkStatus = true }) => ({
  title: 'Rebase branch',
  task: () =>
    new Listr(
      [
        {
          title: 'Remote info',
          task: () => git.remote('-v')
        },
        {
          title: 'Check status',
          enabled: () => checkStatus,
          task: () => checkBranchRemoteStatus({ force, featureBranch })
        },
        {
          title: `Rebase from ${chalk.green(fromBranch)}`,
          task: () => git.rebase(fromBranch)
        }
      ],
      { concurrent: false }
    )
});

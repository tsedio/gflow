const git = require('../../git/index');
const config = require('../../config/index');

module.exports = ({ featureBranch, upstream = true, noVerify = true, force = false }) => ({
  title: `Push ${featureBranch}`,
  task: () => git.push(
    upstream ? '-u' : '',
    force ? '-f' : '',
    config.remote,
    featureBranch,
    noVerify ? '--no-verify' : ''
  )
});

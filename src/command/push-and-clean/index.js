const Listr = require("listr");
const runPushBranch = require("../push-branch");
const runRemoveRemoteBranch = require("../remove-remote-branch");
const runRemoveLocaleBranch = require("../remove-locale-branch");

module.exports = ({ featureBranch, fromLocalBranch } = {}) => ({
  title: "Push and clean",
  task: () =>
    new Listr(
      [
        runPushBranch({
          featureBranch: fromLocalBranch,
          force: false,
          noVerify: true
        }),
        runRemoveRemoteBranch({ featureBranch }),
        runRemoveLocaleBranch({ featureBranch })
      ],
      { concurrency: false }
    )
});

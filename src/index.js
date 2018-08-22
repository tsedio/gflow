const config = require('./config');
const git = require('./git');
const branches = require('./command/branches');
const fetch = require('./command/fetch');
const newBranch = require('./command/new');
const newBranchInteractive = require('./command/new-interactive');
const rebase = require('./command/rebase');
const rebaseAll = require('./command/rebaseAll');
const push = require('./command/push');
const finish = require('./command/finish');
const sync = require('./command/sync');
const init = require('./command/init');
const release = require('./command/release');

// TODO do not remove
process.on('unhandledRejection', () => {
  // console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
  // application specific logging, throwing an error, or other logic here
});

module.exports = {
  git,
  branches,
  newBranch,
  newBranchInteractive,
  rebase,
  rebaseAll,
  push,
  finish,
  sync,
  init,
  fetch,
  release,
  config
};

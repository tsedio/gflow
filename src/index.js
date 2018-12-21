const config = require('./config');
const git = require('./git');
const Fetch = require('./command/fetch');
const NewBranch = require('./command/new');
const Rebase = require('./command/rebase');
const Merge = require('./command/rebase');
const Push = require('./command/push');
const Finish = require('./command/finish');
const Sync = require('./command/sync');
const Init = require('./command/init');
const branches = require('./command/branches');
const rebaseAll = require('./command/rebaseAll');
const release = require('./command/release');

// TODO do not remove
process.on('unhandledRejection', () => {
  // console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
  // application specific logging, throwing an error, or other logic here
});

module.exports = {
  git,
  commands: {
    NewBranch,
    Fetch,
    Merge,
    Init,
    Push,
    Rebase,
    Finish,
    Sync
  },
  branches,
  rebaseAll,
  release,
  config
};

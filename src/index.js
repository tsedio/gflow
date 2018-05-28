'use strict';
const git = require('./git');
const branches = require('./branches');
const fetch = require('./fetch');
const newBranch = require('./new');
const rebase = require('./rebase');
const rebaseAll = require('./rebaseAll');
const push = require('./push');
const finish = require('./finish');
const sync = require('./sync');
const init = require('./init');
const release = require('./release');
const config = require('./config');


// TODO do not remove
process.on('unhandledRejection', (reason, p) => {
  // console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
  // application specific logging, throwing an error, or other logic here
});

module.exports = {
  git,
  branches,
  newBranch,
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
'use strict'
const _ = require('lodash')
const readPkgUp = require('read-pkg-up')
const git = require('./actions/git')
const branches = require('./actions/branches')
const fetch = require('./actions/fetch')
const newBranch = require('./actions/new')
const rebase = require('./actions/rebase')
const push = require('./actions/push')
const finish = require('./actions/finish')
const sync = require('./actions/sync')
const init = require('./actions/init')

let gflowConfiguration

process.on('unhandledRejection', (reason, p) => {
  // console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
  // application specific logging, throwing an error, or other logic here
})

module.exports = {
  git,
  branches,
  newBranch,
  rebase,
  push,
  finish,
  sync,
  init,
  fetch,
  getConfiguration() {

    if (gflowConfiguration) {
      return Promise.resolve(gflowConfiguration)
    }

    return readPkgUp().then(({ pkg }) => {
      gflowConfiguration = _.cloneDeep(pkg.gflow || {})
      return pkg.gflow || {
        production: 'production',
        master: 'master'
      }
    })
      .catch((er) => {
        return {
          production: 'production',
          master: 'master'
        }
      })
  }
}
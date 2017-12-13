#!/usr/bin/env node
'use strict'

const commander = require('commander')
const chalk = require('chalk')
const { newBranch, getConfiguration } = require('../src')

let options = {
  branchName: '',
  type: 'feat'
}

commander
  .usage('<branchName> [options]')
  .alias('gflow startfeat')
  .arguments('<branchName>')
  .option('-o, --from <fromBranch>', 'Create a branch from another branch. By default production.')
  .action((_branchName_) => {
    options.branchName = _branchName_
  })
  .parse(process.argv)

if (!options.branchName) {
  console.error(chalk.red('branchName is required'))
  process.exit(0)
}


getConfiguration()
  .then((config) => {
    options.from = 'origin/' + config.production

    if (commander.from) {
      options.from = commander.from
    }
    newBranch(Object.assign({}, config, options))
  })


#!/usr/bin/env node
'use strict'
const commander = require('commander')
const { sync, getConfiguration } = require('../src')

commander
  .usage('gflow-rebase')
  .action(() => {
  })
  .parse(process.argv)

let options = {}

getConfiguration()
  .then((config) =>
    sync(Object.assign({}, config, options))
  )
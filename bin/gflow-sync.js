#!/usr/bin/env node
'use strict';
const commander = require('commander');
const { sync, config } = require('../src');

commander
  .usage('gflow-rebase')
  .action(() => {
  })
  .parse(process.argv);

sync(config.toObject());
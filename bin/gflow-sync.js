#!/usr/bin/env node

const commander = require('commander');
const { sync, config } = require('../src');

commander
  .usage('gflow-rebase')
  .action(() => {})
  .parse(process.argv);

sync(config.toObject());

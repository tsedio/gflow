#!/usr/bin/env node
'use strict';
const commander = require('commander');
const { push, config } = require('../src');

commander
  .usage('[options]')
  .alias('gflow push')
  .option('-f, --force', 'Force pushing branch.', (v, t) => t + 1, 0)
  .option('-s, --skip', 'Skip the unit test.', (v, t) => t + 1, 0)
  .action(() => {
  })
  .parse(process.argv);

let options = {
  test: !commander.skip,
  force: !!commander.force
};

config
  .then(() => {
    push(options);
  });
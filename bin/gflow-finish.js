#!/usr/bin/env node
'use strict';
const commander = require('commander');
const { finish, getConfiguration } = require('../src');

commander
  .alias('gflow finish')
  .option('-s, --skip', 'Skip the unit test.', (v, t) => t + 1, 0)
  .action(() => {
  })
  .parse(process.argv);

getConfiguration()
  .then((config) => {
    finish(Object.assign({}, config, {
      test: !commander.skip
    }));
  });


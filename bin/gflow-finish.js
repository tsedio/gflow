#!/usr/bin/env node
'use strict';
const commander = require('commander');
const {finish, config} = require('../src');
commander
  .alias('gflow finish')
  .option('-s, --skip', 'Skip the unit test.', (v, t) => t + 1, 0)
  .action(() => {
  })
  .parse(process.argv);

config
  .then((config) => {
    finish(Object.assign({}, config, {
      test: !commander.skip
    }));
  });


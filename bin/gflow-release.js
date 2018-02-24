#!/usr/bin/env node
'use strict';
const commander = require('commander');
const { release, getConfiguration } = require('../src');
const options = {
  action: 'post'
};
commander
  .alias('gflow release')
  .usage('gflow release [pre|post]')
  .arguments('<action>')
  .action((action) => {
    options.action = action || 'post';
  })
  .parse(process.argv);

getConfiguration()
  .then((config) => {
    release[ options.action ](Object.assign({}, config, {}));
  });


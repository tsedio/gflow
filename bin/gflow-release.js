#!/usr/bin/env node
'use strict';
const commander = require('commander');
const { release, config } = require('../src');
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

config
  .then((settings) => {
    console.log('[Gflow release] Start', options.action, 'action');
    release[options.action](settings);
  })
  .catch(er => {

  });


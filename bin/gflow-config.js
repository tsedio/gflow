#!/usr/bin/env node

const commander = require('commander');
const { config } = require('../src');

const options = {};

commander
  .usage('<action>')
  .alias('gflow config <action>')
  .arguments('<action>')
  .action(action => {
    options.action = action;
  })
  .on('--help', () => {
    console.log('');
    console.log('  Examples:');
    console.log('');
    console.log('    $ gflow config list');
    console.log('');
  })
  .parse(process.argv);

switch (options.action) {
  default:
  case 'list':
    console.log(config.toObject());
}

#!/usr/bin/env node

const commander = require('commander');
const chalk = require('chalk');
const figures = require('figures');
const { cleanRefs } = require('../src');

commander
  .alias('gflow config clean-refs')
  .parse(process.argv);

cleanRefs();

console.log(
  chalk.green(figures.tick),
  `References configuration cleaned`
);

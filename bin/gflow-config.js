#!/usr/bin/env node

const commander = require('commander');
const updateNotifier = require('update-notifier');
const cliPkg = require('../package.json');
const pkg = require('../package.json');

updateNotifier({ pkg, updateCheckInterval: 0 }).notify();

commander
  .version(cliPkg.version)
  .command('set-ref', 'Set a branch reference for a given branch')
  .command('get-ref', 'Get branch reference')
  .command('clean-refs', 'Clean entries')
  .parse(process.argv);


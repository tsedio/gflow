#!/usr/bin/env node

const commander = require('commander');
const updateNotifier = require('update-notifier');
const cliPkg = require('../package.json');
const pkg = require('../package.json');

updateNotifier({ pkg, updateCheckInterval: 0 }).notify();

commander
  .version(cliPkg.version)
  .command('branches', 'List all branches status')
  .command('finish', 'Merge the current branch on the referenced branch (production or ancestor) and delete it')
  .command('merge', 'Merge the current branch on the referenced branch (production or ancestor) without delete it')
  .command(
    'release',
    'Create the release tag on the production branch. Synchronize the dev branch and production branch  (for CI like travis)'
  )
  .command('init', 'Create a new git flow project')
  .command('new', 'Create a new branch from the latest commit of production branch')
  .command('push', 'Rebase the current branch from production and push all commit (run test before)')
  .command('publish', 'Alias of push command')
  .command('rebase', 'Rebase the current branch from production')
  .command('rebase-all', 'Rebase all branches from production')
  .command('fetch', 'Download objects and refs from another repository (--all and --prune)')
  .command('sync', 'Synchronize dev branch and production')
  .command('config', 'Configuration')
  .parse(process.argv);

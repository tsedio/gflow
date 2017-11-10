#!/usr/bin/env node

const commander = require("commander");
const updateNotifier = require("update-notifier");
const cliPkg = require("../package.json");
const pkg = require("../package.json");

updateNotifier({pkg}).notify();

commander
  .version(cliPkg.version)
  .command("branches", "List all branches status")
  .command("finish", "Merge the current branch on the production branch and delete it")
  .command("init", "Create a new git flow project")
  .command("new", "Create a new branch from the latest commit of production branch")
  .command("startfeat", "Create a new feature branch from the latest commit of production branch")
  .command("startfix", "Create a new fix branch from the latest commit of production branch")
  .command("push", "Rebase the current branch from production and push all commit (run test before)")
  .command("publish", "Alias of push command")
  .command("rebase", "Rebase the current branch from production")
  //.command("rebase-all", "Rebase all branches")
  .command("sync", "Synchronise master branch and production")
  .parse(process.argv);


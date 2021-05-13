#!/usr/bin/env node

const commander = require("commander");
const { release, config } = require("../src");

const options = {
  action: "post"
};
commander
  .alias("gflow release")
  .usage("gflow release [pre|prepare|success|post]")
  .arguments("<action>")
  .action(action => {
    options.action = action || "post";
  })
  .parse(process.argv);

console.log("[Gflow release] Start", options.action, "action");
release[options.action](config.toObject());

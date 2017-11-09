"use strict";
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs-extra");
const _ = require("lodash");
const cwd = process.cwd();

const questions = [
  {
    type: "input",
    name: "master",
    message: "What is your development branch name ?",
    default: "master"
  },
  {
    type: "input",
    name: "production",
    message: "What is your production branch name ?",
    default: "production"
  }
];

function mergeJson(fileName, newContent) {
  const destinationPath = path.join(cwd, fileName);
  const content = fs.readJSONSync(destinationPath, {});

  _.mergeWith(content, newContent, (a, b) => {
    if (_.isArray(a)) {
      return _.uniq(a.concat(b));
    }
  });
  return fs.writeJSON(destinationPath, content, {spaces: 2});
}

function runInteractive() {
  return inquirer.prompt(questions)
    .then((answers) => {
      mergeJson("./package.json", {
        "gflow": {
          "master": answers.master,
          "production": answers.production
        }
      });
    });
}

module.exports = runInteractive;
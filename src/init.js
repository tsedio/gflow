const inquirer = require('inquirer');
const config = require('./config');

module.exports = () =>
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'remote',
        message: 'What is your remote alias name ?',
        default: config.remote
      },
      {
        type: 'input',
        name: 'develop',
        message: 'What is your development branch name ?',
        default: config.develop
      },
      {
        type: 'input',
        name: 'production',
        message: 'What is your production branch name ?',
        default: config.production
      }
    ])
    .then(answers => {
      config.setConfig(answers);
      config.writeConfiguration();
    });

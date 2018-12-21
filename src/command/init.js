const inquirer = require('inquirer');
const config = require('../config/index');

const QUESTIONS = [
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
];

module.exports = {
  QUESTIONS,

  async askQuestions() {
    const answers = await inquirer.prompt(QUESTIONS);

    return module.exports.initConfiguration(answers);
  },

  initConfiguration(options) {
    config.setConfig(options);
    config.writeConfiguration();
  }
};

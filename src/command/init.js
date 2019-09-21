const inquirer = require('inquirer');
const config = require('../config/index');
const { ConfigSchema } = require('../config/base-config');

const QUESTIONS = ConfigSchema
  .filter(c => !!c.message)
  .map((c) => (
    {
      ...c,
      default: config.get(c.name) || c.default
    }
  ));

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

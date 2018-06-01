const chalk = require('chalk');
const figures = require('figures');
const config = require('./config');

module.exports = () => {
  config.refs.cleanReferences().forEach(info => {
    console.log(chalk.green(figures.tick), `Clean reference ${info.branch} => ${info.ref}`);
  });

  config.writeConfiguration();
};

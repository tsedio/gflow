const chalk = require('chalk');
const figures = require('figures');
const config = require('./config');
const { getBranchName } = require('./utils');
const { branchExists } = require('./git');


module.exports = () => {
  Object.keys(config.refs)
    .forEach((branch) => {
      const ref = config.refs[branch];

      if (!branchExists(getBranchName(ref))) {
        delete config.refs[branch];

        console.log(chalk.green(figures.tick), `Clean reference ${branch} => ${ref}`);
      }
    });

  config.writeConfiguration();
};
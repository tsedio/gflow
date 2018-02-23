const hasYarn = require('has-yarn');
const exec = require('../exec');

module.exports = (options) => ({
  title: 'Test',
  skip: () => !options.test,
  task: () => exec('npm', [ 'test' ], {
    env: {
      CI: 'GFLOW'
    }
  })
});
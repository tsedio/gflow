const hasYarn = require('has-yarn');
const exec = require('../../exec');

module.exports = options => ({
  title: 'Test',
  skip: () => !options.test,
  task: () => exec(hasYarn ? 'yarn' : 'npm', ['test'], {
    env: {
      CI: 'GFLOW'
    }
  })
});

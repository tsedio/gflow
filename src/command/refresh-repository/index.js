const git = require('../../git/index');

module.exports = ({ output = [] } = {}) => ({
  title: 'Refresh local repository',
  task: () => {
    const observable = git.refreshRepository();

    observable.subscribe(result => {
      output.push(result);
    });

    return observable;
  }
});

const chalk = require('chalk');
const Listr = require('listr');
const { refreshRepository } = require('./git');

function runInteractive() {
  const output = [];
  const tasks = new Listr([
    {
      title: 'Refresh local repository',
      task: () => {
        const observable = refreshRepository();

        observable.subscribe(result => {
          output.push(result);
        });

        return observable;
      }
    }
  ]);

  return tasks
    .run()
    .then(() => console.log(output.filter(l => !l.match('Fetching')).join('\n')))
    .catch(err => {
      console.error(chalk.red(String(err)));
    });
}

module.exports = runInteractive;

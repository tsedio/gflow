'use strict';
const Listr = require('listr');
const chalk = require('chalk');
const figures = require('figures');
const { git, add, commit, reset, push } = require('./git/index');
const fs = require('fs');

const DEFAULT_OPTIONS = {
  master: 'master',
  production: 'production'
};

function runInteractive(options = {}) {
  options = Object.assign({}, DEFAULT_OPTIONS, options);

  const pkg = JSON.parse(fs.readFileSync('./package.json', { encoding: 'utf8' }));
  const {
    version,
    repository: { url }
  } = pkg;
  const repository = url.replace('https://', '');

  fs.writeFileSync('./package.json', JSON.stringify(pkg, null, 2), { encoding: 'utf8' });

  console.log(`Generate release tag for v${version}`);
  console.log(`REPOSITORY:      ${repository}`);
  console.log(`RELEASE_BRANCH:  ${options.production}`);
  console.log(`MASTER_BRANCH:   ${options.master}`);

  const { TRAVIS_BUILD_NUMBER, GH_TOKEN } = process.env;

  if (!TRAVIS_BUILD_NUMBER || !GH_TOKEN) {
    return Promise.resolve();
  }

  console.log(`TRAVIS BUILD:    ${TRAVIS_BUILD_NUMBER}`);
  git('remote', 'add', 'origin-repo', `https://${GH_TOKEN}@${repository}`);

  const tasks = new Listr([
    {
      title: `Adding files to commit`,
      task: () => add('-A')
    },
    {
      title: `Reset .npmrc`,
      task: () => reset('--', '.npmrc')
    },
    {
      title: `Commit files`,
      task: () => commit('-m', `Release: ${TRAVIS_BUILD_NUMBER ? TRAVIS_BUILD_NUMBER + '' : ''}v${version} [ci skip]`)
    },
    {
      title: `Push to ${options.production}`,
      task: () => push('--quiet', '--set-upstream', 'origin-repo', options.production)
    },
    {
      title: `Sync ${options.master} with ${options.production}`,
      task: () => push('-f', 'origin-repo', `${options.production}:refs/heads/${options.master}`)
    }
  ], { concurrency: false });

  return tasks
    .run()
    .then(() => {
      console.log(chalk.green(figures.tick), 'Release tag are applied on git');
    })
    .catch(err => {
      console.error(String(err));
      return Promise.resolve();
    });
}

module.exports = runInteractive;

